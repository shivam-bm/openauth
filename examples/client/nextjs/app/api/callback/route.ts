import { client, setTokens } from "../../auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  console.log('url >>>', url.toString());
  console.log('Origin >>>', url.origin);
  
  const code = url.searchParams.get("code")
  console.log('Code >>>', code);
  console.log('State >>>', url.searchParams.get("state"));

  try {
    const exchanged = await client.exchange(code!, `${url.origin}/api/callback`)
    console.log('Exchange response >>>', exchanged);
    
    if (exchanged.err) {
      console.error('Exchange error details:', exchanged.err);
      return NextResponse.json({ 
        error: exchanged.err,
        code: code,
        callbackUrl: `${url.origin}/api/callback`
      }, { status: 400 })
    }
    
    await setTokens(exchanged.tokens.access, exchanged.tokens.refresh)
    return NextResponse.redirect(`${url.origin}/`)
  } catch (error) {
    console.error('Exchange error >>>', error);
    return NextResponse.json({ 
      error: 'Exchange failed',
      details: error
    }, { status: 400 })
  }
}