import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export const metadata = {
  title: "Verify Your Email | Health Vitals",
  description: "Check your email to verify your account",
}

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-950/30 p-4">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>We've sent a confirmation link to your email address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">What's next?</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex gap-2">
                  <span>1.</span>
                  <span>Check your email inbox</span>
                </li>
                <li className="flex gap-2">
                  <span>2.</span>
                  <span>Click the verification link</span>
                </li>
                <li className="flex gap-2">
                  <span>3.</span>
                  <span>Return here to sign in</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link href="/auth/login" className="block">
                <Button className="w-full">Back to Sign In</Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Return Home
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Didn't receive the email? Check your spam folder or contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
