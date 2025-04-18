// Base API URL
const API_BASE_URL = "https://s-libraries.uz/api"

// Helper function for API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      // Add a timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      // Get more detailed error information
      let errorMessage = `Status: ${response.status} ${response.statusText}`
      try {
        const errorData = await response.json()
        errorMessage += ` - ${JSON.stringify(errorData)}`
      } catch (e) {
        // If we can't parse the error as JSON, just use the status text
      }
      throw new Error(errorMessage)
    }

    return response.json()
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error)
    throw error
  }
}

// Authentication
export async function login(email: string, password: string) {
  // For demo purposes, bypass API calls and return a successful mock response
  console.log("Using mock login response for demo")

  // Check if email and password are provided (basic validation)
  if (!email || !password) {
    throw new Error("Email and password are required")
  }

  // Add some predefined user accounts for demo purposes
  const demoUsers = [
    {
      email: "admin@ezma.uz",
      password: "admin123",
      user: {
        id: "admin-001",
        name: "Admin",
        email: "admin@ezma.uz",
        role: "admin",
      },
    },
    {
      email: "admin@natlib.uz",
      password: "password123",
      user: {
        id: "lib-001",
        name: "Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi",
        email: "admin@natlib.uz",
        role: "librarian",
      },
    },
    {
      email: "library@nuu.uz",
      password: "password123",
      user: {
        id: "lib-002",
        name: "Mirzo Ulug'bek nomidagi O'zbekiston Milliy universiteti kutubxonasi",
        email: "library@nuu.uz",
        role: "librarian",
      },
    },
    {
      email: "demo@ezma.uz",
      password: "demo123",
      user: {
        id: "user-001",
        name: "Demo Foydalanuvchi",
        email: "demo@ezma.uz",
        role: "user",
      },
    },
  ]

  // Check if the provided credentials match any demo user
  // Use trim() to remove any whitespace and make comparison case-insensitive for email
  const matchedUser = demoUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase().trim() && user.password === password.trim(),
  )

  if (matchedUser) {
    // Return a successful login response with the matched user data
    return {
      token: `mock-jwt-token-for-${matchedUser.user.id}`,
      user: matchedUser.user,
    }
  } else {
    // Simulate authentication failure for incorrect credentials
    throw new Error("Invalid email or password")
  }
}

export async function register(libraryData: any) {
  // For demo purposes, bypass API calls and return a successful mock response
  console.log("Using mock registration response for demo")

  // Basic validation
  if (!libraryData.name || !libraryData.email || !libraryData.password) {
    throw new Error("Kutubxona nomi, email va parol kiritilishi shart")
  }

  // Check if email is in a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(libraryData.email)) {
    throw new Error("Email manzili noto'g'ri formatda")
  }

  // Check if password is strong enough
  if (libraryData.password.length < 6) {
    throw new Error("Parol kamida 6 ta belgidan iborat bo'lishi kerak")
  }

  // Check if passwords match (if confirmPassword is provided)
  if (libraryData.confirmPassword && libraryData.password !== libraryData.confirmPassword) {
    throw new Error("Parollar mos kelmadi")
  }

  // Check if email is already in use
  const existingEmails = ["admin@natlib.uz", "library@nuu.uz", "demo@ezma.uz", "admin@ezma.uz"]
  if (existingEmails.includes(libraryData.email)) {
    throw new Error("Bu email manzili allaqachon ro'yxatdan o'tgan")
  }

  // Create a new user object
  const newUser = {
    id: `lib-${Math.floor(Math.random() * 1000)}`,
    name: libraryData.name,
    email: libraryData.email,
    role: "librarian",
    status: "pending", // New libraries start with pending status
  }

  // Return a successful registration response with the user object
  return {
    success: true,
    message: "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi. Administrator tasdig'idan so'ng tizimga kirishingiz mumkin.",
    user: newUser,
  }
}

// Libraries
export async function getLibraries(params = {}) {
  // For demo purposes, bypass API calls and return mock data directly
  console.log("Using mock libraries data for demo")

  // Mock libraries data
  const allLibraries = [
    {
      id: "lib-001",
      name: "Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi",
      address: "Toshkent sh., Navoiy ko'chasi, 1-uy",
      email: "admin@natlib.uz",
      image: "/placeholder.svg?height=200&width=300",
      books_count: 7000000,
      status: "active",
      created_at: "2023-01-15T10:30:00Z",
    },
    {
      id: "lib-002",
      name: "Mirzo Ulug'bek nomidagi O'zbekiston Milliy universiteti kutubxonasi",
      address: "Toshkent sh., Universitet ko'chasi, 4-uy",
      email: "library@nuu.uz",
      image: "/placeholder.svg?height=200&width=300",
      books_count: 1500000,
      status: "active",
      created_at: "2023-02-20T14:15:00Z",
    },
    {
      id: "lib-003",
      name: "Toshkent axborot texnologiyalari universiteti kutubxonasi",
      address: "Toshkent sh., Amir Temur shoh ko'chasi, 108-uy",
      email: "library@tuit.uz",
      image: "/placeholder.svg?height=200&width=300",
      books_count: 500000,
      status: "pending",
      created_at: "2023-05-10T09:45:00Z",
    },
    {
      id: "lib-004",
      name: "O'zbekiston Fanlar akademiyasi kutubxonasi",
      address: "Toshkent sh., Ziyolilar ko'chasi, 70-uy",
      email: "library@academy.uz",
      image: "/placeholder.svg?height=200&width=300",
      books_count: 3000000,
      status: "active",
      created_at: "2023-03-05T11:20:00Z",
    },
    {
      id: "lib-005",
      name: "Toshkent davlat sharqshunoslik instituti kutubxonasi",
      address: "Toshkent sh., Shahrisabz ko'chasi, 25-uy",
      email: "library@tashgiv.uz",
      image: "/placeholder.svg?height=200&width=300",
      books_count: 800000,
      status: "inactive",
      created_at: "2023-04-18T16:30:00Z",
    },
    {
      id: "lib-006",
      name: "O'zbekiston davlat jahon tillari universiteti kutubxonasi",
      address: "Toshkent sh., Kichik halqa yo'li, 21-a uy",
      email: "library@uzswlu.uz",
      image: "/placeholder.svg?height=200&width=300",
      books_count: 600000,
      status: "pending",
      created_at: "2023-06-22T13:10:00Z",
    },
  ]

  // If admin parameter is provided, return all libraries with status
  if (params && params.hasOwnProperty("admin") && params.admin) {
    return { results: allLibraries }
  }

  // For non-admin requests, filter out inactive and pending libraries
  const publicLibraries = allLibraries.filter((lib) => lib.status === "active")

  // If search parameter is provided, filter libraries
  if (params && params.hasOwnProperty("search") && params.search) {
    const searchQuery = params.search.toString().toLowerCase()
    const filteredLibraries = publicLibraries.filter(
      (library) =>
        library.name.toLowerCase().includes(searchQuery) || library.address.toLowerCase().includes(searchQuery),
    )
    return { results: filteredLibraries }
  }

  // Return active libraries if no search parameter
  return { results: publicLibraries }
}

export async function getLibraryById(id: string) {
  // For demo purposes, bypass API calls and return mock data directly
  console.log(`Using mock library data for ID ${id}`)

  // Mock library data
  const libraries = [
    {
      id: 1,
      name: "Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi",
      address: "Toshkent sh., Navoiy ko'chasi, 1-uy",
      description:
        "O'zbekiston Milliy kutubxonasi — O'zbekistondagi eng yirik kutubxona. 1870-yilda Toshkent jamoat kutubxonasi sifatida tashkil etilgan. 2002-yildan beri Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi deb ataladi.",
      phone: "+998 71 232 83 94",
      email: "info@natlib.uz",
      website: "https://natlib.uz",
      working_hours: "Dushanba-Shanba: 9:00 - 20:00, Yakshanba: Dam olish kuni",
      image: "/placeholder.svg?height=400&width=800",
      books_count: 7000000,
      latitude: 41.311081,
      longitude: 69.280624,
      status: "active",
    },
    {
      id: 2,
      name: "Mirzo Ulug'bek nomidagi O'zbekiston Milliy universiteti kutubxonasi",
      address: "Toshkent sh., Universitet ko'chasi, 4-uy",
      description:
        "O'zbekiston Milliy universiteti kutubxonasi 1918-yilda tashkil etilgan bo'lib, O'zbekistondagi eng qadimiy va eng yirik akademik kutubxonalardan biri hisoblanadi.",
      phone: "+998 71 246 95 31",
      email: "library@nuu.uz",
      website: "https://nuu.uz/library",
      working_hours: "Dushanba-Juma: 9:00 - 18:00, Shanba: 9:00 - 15:00, Yakshanba: Dam olish kuni",
      image: "/placeholder.svg?height=400&width=800",
      books_count: 1500000,
      latitude: 41.341456,
      longitude: 69.284787,
      status: "active",
    },
    {
      id: 3,
      name: "Toshkent axborot texnologiyalari universiteti kutubxonasi",
      address: "Toshkent sh., Amir Temur shoh ko'chasi, 108-uy",
      description:
        "Toshkent axborot texnologiyalari universiteti kutubxonasi axborot texnologiyalari, telekommunikatsiya va dasturlash sohasidagi adabiyotlarga boy kutubxona hisoblanadi.",
      phone: "+998 71 238 64 20",
      email: "library@tuit.uz",
      website: "https://tuit.uz/library",
      working_hours: "Dushanba-Juma: 9:00 - 18:00, Shanba: 9:00 - 14:00, Yakshanba: Dam olish kuni",
      image: "/placeholder.svg?height=400&width=800",
      books_count: 500000,
      latitude: 41.341176,
      longitude: 69.287303,
      status: "pending",
    },
    {
      id: 4,
      name: "O'zbekiston Fanlar akademiyasi kutubxonasi",
      address: "Toshkent sh., Ziyolilar ko'chasi, 70-uy",
      description:
        "O'zbekiston Fanlar akademiyasi kutubxonasi ilmiy adabiyotlar va tadqiqot materiallariga boy bo'lib, olimlar va tadqiqotchilar uchun muhim manba hisoblanadi.",
      phone: "+998 71 262 74 58",
      email: "library@academy.uz",
      website: "https://academy.uz/library",
      working_hours: "Dushanba-Juma: 9:00 - 17:00, Shanba-Yakshanba: Dam olish kuni",
      image: "/placeholder.svg?height=400&width=800",
      books_count: 3000000,
      latitude: 41.325876,
      longitude: 69.290123,
      status: "active",
    },
    {
      id: 5,
      name: "Toshkent davlat sharqshunoslik instituti kutubxonasi",
      address: "Toshkent sh., Shahrisabz ko'chasi, 25-uy",
      description:
        "Toshkent davlat sharqshunoslik instituti kutubxonasi sharq tillari, madaniyati va tarixi bo'yicha noyob kitoblar to'plamiga ega.",
      phone: "+998 71 233 40 50",
      email: "library@tashgiv.uz",
      website: "https://tashgiv.uz/library",
      working_hours: "Dushanba-Juma: 9:00 - 18:00, Shanba: 9:00 - 13:00, Yakshanba: Dam olish kuni",
      image: "/placeholder.svg?height=400&width=800",
      books_count: 800000,
      latitude: 41.318765,
      longitude: 69.254321,
      status: "inactive",
    },
    {
      id: 6,
      name: "O'zbekiston davlat jahon tillari universiteti kutubxonasi",
      address: "Toshkent sh., Kichik halqa yo'li, 21-a uy",
      description:
        "O'zbekiston davlat jahon tillari universiteti kutubxonasi chet tillari va lingvistika sohasidagi adabiyotlarga ixtisoslashgan.",
      phone: "+998 71 230 12 91",
      email: "library@uzswlu.uz",
      website: "https://uzswlu.uz/library",
      working_hours: "Dushanba-Juma: 9:00 - 18:00, Shanba: 9:00 - 14:00, Yakshanba: Dam olish kuni",
      image: "/placeholder.svg?height=400&width=800",
      books_count: 600000,
      latitude: 41.328901,
      longitude: 69.268765,
      status: "pending",
    },
  ]

  // Find the library with the matching ID
  const library = libraries.find((lib) => lib.id === Number.parseInt(id))

  // Return the library if found, otherwise return null
  return library || null
}

// Admin functions
export async function activateLibrary(libraryId: string) {
  // For demo purposes, simulate a successful activation
  console.log(`Mock activating library ID ${libraryId}`)

  // Return a mock success response
  return {
    success: true,
    message: "Kutubxona muvaffaqiyatli faollashtirildi",
  }
}

export async function deactivateLibrary(libraryId: string) {
  // For demo purposes, simulate a successful deactivation
  console.log(`Mock deactivating library ID ${libraryId}`)

  // Return a mock success response
  return {
    success: true,
    message: "Kutubxona muvaffaqiyatli o'chirildi",
  }
}

// Books
export async function searchBooks(query: string) {
  // For demo purposes, bypass API calls and return mock data directly
  console.log("Using mock search results for demo")

  if (!query || query.trim() === "") {
    return { results: [] } // Return empty results for empty queries
  }

  // Mock search results
  const allBooks = [
    {
      id: 1,
      title: "O'tkan kunlar",
      author: "Abdulla Qodiriy",
      image: "/placeholder.svg?height=300&width=200",
      libraries: [
        {
          id: 1,
          name: "Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi",
          address: "Toshkent sh., Navoiy ko'chasi, 1-uy",
        },
        {
          id: 2,
          name: "Mirzo Ulug'bek nomidagi O'zbekiston Milliy universiteti kutubxonasi",
          address: "Toshkent sh., Universitet ko'chasi, 4-uy",
        },
      ],
    },
    {
      id: 2,
      title: "Kecha va kunduz",
      author: "Cho'lpon",
      image: "/placeholder.svg?height=300&width=200",
      libraries: [
        {
          id: 1,
          name: "Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi",
          address: "Toshkent sh., Navoiy ko'chasi, 1-uy",
        },
      ],
    },
    {
      id: 3,
      title: "Sarob",
      author: "Abdulla Qahhor",
      image: "/placeholder.svg?height=300&width=200",
      libraries: [
        {
          id: 3,
          name: "Toshkent axborot texnologiyalari universiteti kutubxonasi",
          address: "Toshkent sh., Amir Temur shoh ko'chasi, 108-uy",
        },
      ],
    },
    {
      id: 4,
      title: "Shum bola",
      author: "G'afur G'ulom",
      image: "/placeholder.svg?height=300&width=200",
      libraries: [
        {
          id: 1,
          name: "Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi",
          address: "Toshkent sh., Navoiy ko'chasi, 1-uy",
        },
        {
          id: 4,
          name: "O'zbekiston Fanlar akademiyasi kutubxonasi",
          address: "Toshkent sh., Ziyolilar ko'chasi, 70-uy",
        },
      ],
    },
  ]

  // Filter books based on query
  const lowercaseQuery = query.toLowerCase()
  const filteredBooks = allBooks.filter(
    (book) => book.title.toLowerCase().includes(lowercaseQuery) || book.author.toLowerCase().includes(lowercaseQuery),
  )

  return { results: filteredBooks }
}

export async function getPopularBooks() {
  // For demo purposes, bypass API calls and return mock data directly
  console.log("Using mock popular books data for demo")
  return {
    results: [
      {
        id: 1,
        title: "O'tkan kunlar",
        author: "Abdulla Qodiriy",
        image: "/placeholder.svg?height=200&width=150",
        libraries_count: 15,
      },
      {
        id: 2,
        title: "Kecha va kunduz",
        author: "Cho'lpon",
        image: "/placeholder.svg?height=200&width=150",
        libraries_count: 12,
      },
      {
        id: 3,
        title: "Sarob",
        author: "Abdulla Qahhor",
        image: "/placeholder.svg?height=200&width=150",
        libraries_count: 10,
      },
      {
        id: 4,
        title: "Shum bola",
        author: "G'afur G'ulom",
        image: "/placeholder.svg?height=200&width=150",
        libraries_count: 8,
      },
    ],
  }
}

export async function getAllBooks(limit = 8) {
  // For demo purposes, bypass API calls and return mock data directly
  console.log("Using mock books data for demo")
  return {
    results: [
      {
        id: 1,
        title: "O'tkan kunlar",
        author: "Abdulla Qodiriy",
        image: "/placeholder.svg?height=200&width=150",
        libraries_count: 15,
      },
      {
        id: 2,
        title: "Kecha va kunduz",
        author: "Cho'lpon",
        image: "/placeholder.svg?height=200&width=150",
        libraries_count: 12,
      },
      {
        id: 3,
        title: "Sarob",
        author: "Abdulla Qahhor",
        image: "/placeholder.svg?height=200&width=150",
        libraries_count: 10,
      },
      {
        id: 4,
        title: "Shum bola",
        author: "G'afur G'ulom",
        image: "/placeholder.svg?height=200&width=150",
        libraries_count: 8,
      },
    ].slice(0, limit),
  }
}

export async function getBooksByLibrary(libraryId: string) {
  // For demo purposes, bypass API calls and return mock data directly
  console.log(`Using mock books data for library ID ${libraryId}`)

  // Mock books data for libraries
  const libraryBooks = {
    "1": [
      { id: 1, title: "O'tkan kunlar", author: "Abdulla Qodiriy", year: 1925, available: true },
      { id: 2, title: "Kecha va kunduz", author: "Cho'lpon", year: 1936, available: true },
      { id: 4, title: "Shum bola", author: "G'afur G'ulom", year: 1936, available: true },
      { id: 5, title: "Yulduzli tunlar", author: "Pirimqul Qodirov", year: 1978, available: true },
      { id: 8, title: "Ulug'bek xazinasi", author: "Odil Yoqubov", year: 1973, available: false },
    ],
    "2": [
      { id: 1, title: "O'tkan kunlar", author: "Abdulla Qodiriy", year: 1925, available: true },
      { id: 6, title: "Navoiy", author: "Oybek", year: 1944, available: true },
      { id: 9, title: "Qutlug' qon", author: "Oybek", year: 1940, available: false },
    ],
    "3": [
      { id: 3, title: "Sarob", author: "Abdulla Qahhor", year: 1943, available: false },
      { id: 7, title: "Qo'shchinor chiroqlari", author: "Abdulla Qahhor", year: 1951, available: true },
    ],
    "4": [
      { id: 4, title: "Shum bola", author: "G'afur G'ulom", year: 1936, available: true },
      { id: 10, title: "Mening o'g'rigina bolam", author: "G'afur G'ulom", year: 1965, available: true },
    ],
    "5": [
      { id: 11, title: "Boburnoma", author: "Zahiriddin Muhammad Bobur", year: 1530, available: true },
      { id: 12, title: "Xamsa", author: "Alisher Navoiy", year: 1483, available: true },
    ],
    "6": [
      { id: 13, title: "Ingliz tili grammatikasi", author: "Raymond Murphy", year: 2019, available: true },
      { id: 14, title: "Nemis tili lug'ati", author: "Muallif jamoasi", year: 2020, available: true },
    ],
  }

  // Return books for the specified library or an empty array if not found
  return { results: libraryBooks[libraryId] || [] }
}

export async function addBook(libraryId: string, bookData: any) {
  // For demo purposes, simulate a successful book addition
  console.log(`Mock adding book to library ID ${libraryId}:`, bookData)

  // Check if the library is active
  const allLibraries = [
    {
      id: "lib-001",
      status: "active",
    },
    {
      id: "lib-002",
      status: "active",
    },
    {
      id: "lib-003",
      status: "pending",
    },
    {
      id: "lib-004",
      status: "active",
    },
    {
      id: "lib-005",
      status: "inactive",
    },
    {
      id: "lib-006",
      status: "pending",
    },
  ]

  const library = allLibraries.find((lib) => lib.id === libraryId)

  if (!library) {
    throw new Error("Kutubxona topilmadi")
  }

  if (library.status !== "active") {
    throw new Error("Kutubxona faol emas. Kitob qo'shish uchun administrator tomonidan faollashtirilishi kerak.")
  }

  // Return a mock success response
  return {
    id: Math.floor(Math.random() * 1000) + 100, // Generate a random ID for the new book
    ...bookData,
    created_at: new Date().toISOString(),
  }
}

export async function addBooksFromExcel(libraryId: string, formData: FormData) {
  // For demo purposes, simulate a successful Excel upload
  console.log(`Mock uploading Excel file to library ID ${libraryId}`)

  // Check if the library is active
  const allLibraries = [
    {
      id: "lib-001",
      status: "active",
    },
    {
      id: "lib-002",
      status: "active",
    },
    {
      id: "lib-003",
      status: "pending",
    },
    {
      id: "lib-004",
      status: "active",
    },
    {
      id: "lib-005",
      status: "inactive",
    },
    {
      id: "lib-006",
      status: "pending",
    },
  ]

  const library = allLibraries.find((lib) => lib.id === libraryId)

  if (!library) {
    throw new Error("Kutubxona topilmadi")
  }

  if (library.status !== "active") {
    throw new Error("Kutubxona faol emas. Kitob qo'shish uchun administrator tomonidan faollashtirilishi kerak.")
  }

  // Return a mock success response
  return {
    success: true,
    message: "Excel file processed successfully",
    books_added: 15,
    books_updated: 3,
  }
}

// Add this function after the addBooksFromExcel function

export async function updateLibraryProfile(libraryId: string, profileData: any) {
  // For demo purposes, simulate a successful profile update
  console.log(`Mock updating profile for library ID ${libraryId}:`, profileData)

  // Check if the library is active
  const allLibraries = [
    {
      id: "lib-001",
      status: "active",
    },
    {
      id: "lib-002",
      status: "active",
    },
    {
      id: "lib-003",
      status: "pending",
    },
    {
      id: "lib-004",
      status: "active",
    },
    {
      id: "lib-005",
      status: "inactive",
    },
    {
      id: "lib-006",
      status: "pending",
    },
  ]

  const library = allLibraries.find((lib) => lib.id === libraryId)

  if (!library) {
    throw new Error("Kutubxona topilmadi")
  }

  if (library.status !== "active") {
    throw new Error("Kutubxona faol emas. Profilni tahrirlash uchun administrator tomonidan faollashtirilishi kerak.")
  }

  // Validate required fields
  if (!profileData.name || !profileData.address || !profileData.phone || !profileData.email) {
    throw new Error("Barcha majburiy maydonlar to'ldirilishi kerak")
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(profileData.email)) {
    throw new Error("Email formati noto'g'ri")
  }

  // Validate coordinates
  if (!profileData.latitude || !profileData.longitude) {
    throw new Error("Joylashuv koordinatalari kiritilishi kerak")
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return a mock success response
  return {
    success: true,
    message: "Kutubxona ma'lumotlari muvaffaqiyatli yangilandi",
    updatedAt: new Date().toISOString(),
  }
}

// Add this function to the api.ts file to get nearby libraries
export async function getNearbyLibraries(latitude: number, longitude: number, radius = 10) {
  // For demo purposes, bypass API calls and return mock data directly
  console.log(`Using mock nearby libraries data for location (${latitude}, ${longitude})`)

  // Mock library data with coordinates
  const libraries = [
    {
      id: 1,
      name: "Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi",
      address: "Toshkent sh., Navoiy ko'chasi, 1-uy",
      latitude: 41.311081,
      longitude: 69.280624,
      distance: 0, // km
    },
    {
      id: 2,
      name: "Mirzo Ulug'bek nomidagi O'zbekiston Milliy universiteti kutubxonasi",
      address: "Toshkent sh., Universitet ko'chasi, 4-uy",
      latitude: 41.341456,
      longitude: 69.284787,
      distance: 3.4, // km
    },
    {
      id: 4,
      name: "O'zbekiston Fanlar akademiyasi kutubxonasi",
      address: "Toshkent sh., Ziyolilar ko'chasi, 70-uy",
      latitude: 41.325876,
      longitude: 69.290123,
      distance: 1.8, // km
    },
    {
      id: 5,
      name: "Toshkent davlat sharqshunoslik instituti kutubxonasi",
      address: "Toshkent sh., Shahrisabz ko'chasi, 25-uy",
      latitude: 41.318765,
      longitude: 69.254321,
      distance: 2.5, // km
    },
    {
      id: 6,
      name: "O'zbekiston davlat jahon tillari universiteti kutubxonasi",
      address: "Toshkent sh., Kichik halqa yo'li, 21-a uy",
      latitude: 41.328901,
      longitude: 69.268765,
      distance: 1.9, // km
    },
  ]

  // Calculate distance from provided coordinates to each library
  // In a real implementation, this would be done on the server
  const librariesWithDistance = libraries.map((library) => {
    // Calculate distance using Haversine formula
    const distance = calculateDistance(latitude, longitude, library.latitude, library.longitude)

    return {
      ...library,
      distance: Number.parseFloat(distance.toFixed(1)),
    }
  })

  // Filter libraries within the specified radius
  const nearbyLibraries = librariesWithDistance
    .filter((library) => library.distance <= radius)
    .sort((a, b) => a.distance - b.distance)

  return { results: nearbyLibraries }
}

// Helper function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return distance
}
