"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";

export default function About() {  const teamMembers = [
    {
      name: "Gilang Pratama",
      role: "Founder & CEO",
      image: "/images/logos/logo_notext_whitebg.png",
      description: "Visioner yang passionate dalam menghubungkan seniman dengan pecinta seni di Indonesia.",
      linkedin: "#",
      instagram: "#"
    },
    {
      name: "Sarah Wijaya",
      role: "Head of Design",
      image: "/images/logos/logo_notext_whitebg.png", 
      description: "Ahli dalam user experience dan desain visual yang memukau.",
      linkedin: "#",
      instagram: "#"
    },
    {
      name: "Andi Kusuma",
      role: "Lead Developer",
      image: "/images/logos/logo_notext_whitebg.png",
      description: "Full-stack developer berpengalaman dengan keahlian teknologi web modern.",
      linkedin: "#",
      instagram: "#"
    }
  ];

  const stats = [
    { number: "500+", label: "Seniman Terdaftar" },
    { number: "2000+", label: "Karya Seni" },
    { number: "10000+", label: "Pengguna Aktif" },
    { number: "15+", label: "Kota di Indonesia" }
  ];

  const values = [
    {
      icon: "🎨",
      title: "Kreativitas",
      description: "Kami mendukung dan menghargai setiap bentuk ekspresi kreatif seniman Indonesia."
    },
    {
      icon: "🤝",
      title: "Komunitas",
      description: "Membangun komunitas yang kuat antara seniman dan penggemar seni."
    },
    {
      icon: "🌟",
      title: "Kualitas",
      description: "Berkomitmen memberikan platform terbaik untuk karya seni berkualitas tinggi."
    },
    {
      icon: "🚀",
      title: "Inovasi",
      description: "Terus berinovasi dalam teknologi untuk mendukung industri seni digital."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tentang PhoRent
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Platform terdepan untuk menyewa dan menjual karya seni digital di Indonesia
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Misi Kami
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                PhoRent hadir untuk menjembatani seniman berbakat di Indonesia dengan 
                para penggemar seni dari seluruh dunia. Kami percaya bahwa setiap karya 
                seni memiliki nilai dan cerita yang patut diapresiasi.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Melalui platform ini, kami ingin memberikan kesempatan yang sama bagi 
                semua seniman untuk mengekspresikan kreativitas mereka dan mendapatkan 
                penghasilan yang layak dari karya mereka.
              </p>
              <div className="flex space-x-4">
                <Link 
                  href="/browse"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Jelajahi Karya Seni
                </Link>
                <Link 
                  href="/sell"
                  className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Jual Karya Anda
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/arts/modernabstractdigart.jpg"
                alt="Modern art showcase"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Dampak PhoRent
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-lg opacity-90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nilai-Nilai Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Prinsip-prinsip yang menjadi fondasi dalam membangun komunitas seni digital Indonesia
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tim Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Orang-orang luar biasa di balik platform PhoRent
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={120}
                  height={120}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-green-600 font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 mb-4">
                  {member.description}
                </p>
                <div className="flex justify-center space-x-4">
                  <a 
                    href={member.linkedin}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label={`LinkedIn ${member.name}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a 
                    href={member.instagram}
                    className="text-pink-600 hover:text-pink-800"
                    aria-label={`Instagram ${member.name}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.281C3.85 14.977 3.014 13.116 3.014 11.987c0-2.676 2.176-4.852 4.852-4.852 1.297 0 2.448.49 3.323 1.281 1.276.73 2.112 2.591 2.112 3.72 0 2.676-2.176 4.852-4.852 4.852z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/images/arts/architecturedraft.jpg"
                alt="Our story"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Cerita Kami
              </h2>              <p className="text-lg text-gray-700 mb-6">
                PhoRent dimulai dari sebuah visi sederhana: memberikan platform yang mudah 
                dan aman bagi seniman Indonesia untuk berbagi karya mereka dengan dunia. 
                Berawal dari sebuah ide sederhana di Bandung pada tahun 2024, kami telah 
                berkembang menjadi platform terpercaya bagi ribuan seniman.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Kami memahami tantangan yang dihadapi seniman dalam memasarkan karya mereka 
                di era digital. Oleh karena itu, PhoRent hadir dengan fitur-fitur yang 
                memudahkan proses jual-beli karya seni, mulai dari upload yang mudah, 
                sistem pembayaran dalam Rupiah yang aman, hingga komunitas yang mendukung.
              </p>
              <p className="text-lg text-gray-700">
                Hari ini, PhoRent bangga menjadi rumah bagi lebih dari 500 seniman berbakat 
                dari Sabang sampai Merauke, dengan beragam gaya dan medium seni yang 
                mencerminkan kekayaan budaya Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bergabunglah dengan Komunitas PhoRent
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Baik Anda seorang seniman yang ingin berbagi karya atau kolektor yang mencari 
            karya seni unik, PhoRent adalah tempat yang tepat untuk Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Daftar Sekarang
            </Link>
            <Link 
              href="/browse"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Explore Karya Seni
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Image
                  src="/images/logos/logo_whitebg.png"
                  alt="PhoRent Logo"
                  width={120}
                  height={40}
                />
              </div>
              <p className="text-gray-400">
                Platform terdepan untuk seni digital Indonesia
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Tautan</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/browse" className="hover:text-white">Jelajahi</Link></li>
                <li><Link href="/sell" className="hover:text-white">Jual</Link></li>
                <li><Link href="/about" className="hover:text-white">Tentang</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Dukungan</h3>              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:hello@phorent.com" className="hover:text-white">Email</a></li>
                <li><Link href="/contact" className="hover:text-white">Kontak</Link></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ikuti Kami</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.281C3.85 14.977 3.014 13.116 3.014 11.987c0-2.676 2.176-4.852 4.852-4.852 1.297 0 2.448.49 3.323 1.281 1.276.73 2.112 2.591 2.112 3.72 0 2.676-2.176 4.852-4.852 4.852z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PhoRent. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
