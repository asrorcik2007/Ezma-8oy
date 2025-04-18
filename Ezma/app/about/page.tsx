import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function AboutPage() {
  // Mock data for team members
  const teamMembers = [
    {
      id: 1,
      name: "Aziz Rahimov",
      role: "Loyiha rahbari",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      name: "Dilnoza Karimova",
      role: "Frontend dasturchi",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 3,
      name: "Bobur Aliyev",
      role: "Backend dasturchi",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 4,
      name: "Nilufar Qosimova",
      role: "UI/UX dizayner",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  // Mock data for FAQs
  const faqs = [
    {
      question: "Ezma nima?",
      answer:
        "Ezma - O'zbekistonda mavjud kutubxonalardan kitob qidirish tizimi. Foydalanuvchilar qidirayotgan kitob qaysi kutubxonada borligini topa olishi va eng yaqin kutubxonani aniqlashi mumkin bo'ladi.",
    },
    {
      question: "Ezma xizmatidan foydalanish pullikmi?",
      answer:
        "Yo'q, Ezma xizmatidan foydalanish to'liq bepul. Siz hech qanday to'lovsiz kitoblarni qidirishingiz va kutubxonalar haqida ma'lumot olishingiz mumkin.",
    },
    {
      question: "Kutubxonam uchun qanday ro'yxatdan o'taman?",
      answer:
        "Kutubxonangizni ro'yxatdan o'tkazish uchun saytning 'Ro'yxatdan o'tish' bo'limiga o'ting va kutubxona sifatida ro'yxatdan o'tish jarayonini boshlang. Kerakli ma'lumotlarni to'ldiring va admin tomonidan tasdiqlanishini kuting.",
    },
    {
      question: "Kitoblarni qanday qidirishim mumkin?",
      answer:
        "Bosh sahifadagi qidiruv maydoniga kitob nomi yoki muallif ismini kiriting va 'Qidirish' tugmasini bosing. Tizim O'zbekistondagi barcha kutubxonalardan siz qidirayotgan kitobni topib beradi.",
    },
    {
      question: "Eng yaqin kutubxonani qanday topaman?",
      answer:
        "Kitobni qidirgandan so'ng, natijalar sahifasida 'Eng yaqin kutubxonani ko'rsatish' tugmasini bosing. Tizim joylashuvingizga asoslanib, eng yaqin kutubxonani xaritada ko'rsatadi.",
    },
    {
      question: "Kutubxonamga kitoblarni qanday qo'shaman?",
      answer:
        "Kutubxonachi sifatida tizimga kirgandan so'ng, 'Kitoblar' bo'limiga o'ting va 'Yangi kitob qo'shish' tugmasini bosing. Kitob ma'lumotlarini qo'lda kiritishingiz yoki Excel fayl orqali yuklashingiz mumkin.",
    },
  ]

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col space-y-12">
        {/* About Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Biz haqimizda</h1>
            <p className="text-muted-foreground">Ezma loyihasi va uning maqsadi haqida ma'lumot</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Loyiha maqsadi</h2>
              <p>
                Ezma loyihasi O'zbekistondagi kutubxonalar va kitobxonlar o'rtasidagi aloqani yaxshilash maqsadida
                yaratilgan. Bizning asosiy maqsadimiz - kitobxonlarga qidirayotgan kitoblarini tezda topishda yordam
                berish va kutubxonalarga o'z kitob fondlarini samarali boshqarish imkoniyatini taqdim etish.
              </p>
              <p>
                Loyiha O'zbekistondagi barcha kutubxonalarni yagona tizimga birlashtirish orqali kitobxonlarga qulaylik
                yaratadi. Foydalanuvchilar o'zlariga kerakli kitobni qidirib, uni qaysi kutubxonada borligini va eng
                yaqin kutubxonani aniqlay olishadi.
              </p>
            </div>
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=400&width=600" alt="Ezma loyihasi" fill className="object-cover" />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Bizning jamoa</h2>
            <p className="text-muted-foreground">Ezma loyihasini yaratgan dasturchilar jamoasi</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={member.image || "/placeholder.svg?height=300&width=300"}
                    alt={member.name || "Jamoa a'zosi"}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Ko'p so'raladigan savollar</h2>
            <p className="text-muted-foreground">Ezma loyihasi haqida eng ko'p beriladigan savollar va javoblar</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  )
}
