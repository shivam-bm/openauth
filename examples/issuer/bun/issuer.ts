import { issuer, IssuerContext, ProviderResponse } from "@openauthjs/openauth"
import { MemoryStorage } from "@openauthjs/openauth/storage/memory"
import { CognitoProvider } from "@openauthjs/openauth/provider/cognito"
import { subjects } from "../../subjects.js"

async function getUser(email: string) {
  // Get user from database
  // Return user ID
  return "123"
}

export default issuer({
  subjects,
  storage: MemoryStorage({
    persist: "./persist.json",
  }),
  providers: {
    cognito: CognitoProvider({
      domain: "",
      region: "",  
      clientID: "",
      clientSecret: "",
      scopes: ["phone", "email", "openid"],
      query: {
        redirect_uri: "http://localhost:3001/api/callback" // TODO: add this url in cognito
      }
    }),
  },
  async allow() {
    return true
  },
  success: async (ctx: IssuerContext, value: ProviderResponse) => {
    console.log('ctx >>', ctx);
    console.log('value >>', value);
    if (value.provider === "cognito") {
      return ctx.subject("user", {
        id: value.tokenset.access // Cognito will provide the user ID directly
      })
    }
    throw new Error("Invalid provider")
  },
})
