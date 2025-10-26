import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit, Eye } from "lucide-react"

export const metadata = {
  title: "Blog Management | Admin",
  description: "Manage blog posts",
}

export default async function BlogManagementPage() {
  const supabase = await createClient()

  // Check if user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  // Fetch all blog posts
  const { data: posts } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Blog Management</h1>
              <p className="text-muted-foreground mt-2">Create and manage blog posts</p>
            </div>
            <Link href="/admin/blog/create">
              <Button>Create Post</Button>
            </Link>
          </div>

          {posts && posts.length > 0 ? (
            <div className="grid gap-4">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                        <CardDescription className="mt-2">{post.excerpt}</CardDescription>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Eye size={16} />
                            View
                          </Button>
                        </Link>
                        <Link href={`/admin/blog/${post.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Edit size={16} />
                            Edit
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm" className="gap-2">
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">No blog posts yet</p>
                <Link href="/admin/blog/create">
                  <Button>Create Your First Post</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
