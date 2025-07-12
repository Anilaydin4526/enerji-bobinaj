import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const blogs = await prisma.blogPost.findMany({
      where: {
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        image: true,
        slug: true,
        content: true,
        createdAt: true
      }
    });
    
    // Content'ten kısa özet oluştur
    const blogsWithSummary = blogs.map(blog => ({
      ...blog,
      summary: blog.content ? blog.content.substring(0, 150) + (blog.content.length > 150 ? '...' : '') : ''
    }));
    
    return NextResponse.json(blogsWithSummary);
  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json({ error: 'Blog yazıları yüklenirken hata oluştu' }, { status: 500 });
  }
} 