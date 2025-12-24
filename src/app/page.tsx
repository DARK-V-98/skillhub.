import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, Layers, Users } from "lucide-react";
import ContactForm from "@/components/contact-form";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Build Your Simple Site With Us
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    We provide the tools and expertise to create a beautiful,
                    functional, and simple website for your needs.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="#contact">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  width={600}
                  height={600}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
              )}
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                  Why Choose Us?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed for simplicity and power, giving you
                  the best of both worlds.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                    <Layers className="h-8 w-8 text-primary" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardTitle>Easy to Use</CardTitle>
                  <p className="text-muted-foreground">
                    Our intuitive tools make website creation a breeze for anyone.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <CheckCircle className="h-8 w-8 text-primary" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardTitle>Reliable</CardTitle>
                  <p className="text-muted-foreground">
                    Enjoy fast, secure, and reliable hosting with 99.9% uptime.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <Users className="h-8 w-8 text-primary" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardTitle>Dedicated Support</CardTitle>
                  <p className="text-muted-foreground">
                    Our expert team is here to help you every step of the way.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Get in Touch
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Have questions or want to start a project? Send us a message!
              </p>
            </div>
            <div className="mx-auto w-full max-w-lg">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
