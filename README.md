# 🚀 GetMan - Modern API Testing Platform

<div align="center">

![GetMan Logo](https://img.shields.io/badge/GetMan-API%20Testing-blue?style=for-the-badge)

**A beautiful, modern alternative to Postman built with Next.js and Appwrite**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Appwrite](https://img.shields.io/badge/Appwrite-Backend-red?style=flat-square&logo=appwrite)](https://appwrite.io/)

[🌐 Live Demo](#) • [📖 Documentation](#features) • [🚀 Quick Start](#getting-started)

</div>

---

## ✨ Features

### 🎯 **Core Functionality**

- **🔧 Request Builder** - Intuitive interface for crafting HTTP requests
- **📊 Response Viewer** - Beautiful response visualization with syntax highlighting
- **📁 Collections** - Organize your APIs into structured collections
- **📜 Request History** - Track and revisit your API testing history
- **🔒 Authentication** - Secure user accounts with Appwrite

### 🎨 **Modern UI/UX**

- **🌙 Dark/Light Theme** - Seamless theme switching
- **📱 Responsive Design** - Perfect on desktop, tablet, and mobile
- **⚡ Fast Performance** - Built with Next.js 15 and Turbopack
- **🎨 Beautiful Components** - Powered by Radix UI and shadcn/ui

### 🚀 **Advanced Features**

- **🔗 Sharing** - Share collections and requests with public links
- **📋 cURL Import/Export** - Convert between cURL and requests
- **🏷️ Method Badges** - Color-coded HTTP method indicators
- **🔍 Smart Headers** - Autocomplete for common HTTP headers
- **💾 Auto-Save** - Never lose your work with intelligent saving

### 🛡️ **Security & Privacy**

- **🔐 Secure Proxy** - All requests go through secure Next.js proxy
- **👤 User Isolation** - Your data stays private and secure
- **⏰ Link Expiration** - Shared links auto-expire for security
- **🚫 CORS Free** - No CORS issues with built-in proxy

---

## 🏗️ Tech Stack

<table>
<tr>
<td>

**Frontend**

- Next.js 15.5.0
- React 19.1.0
- Tailwind CSS 4.0
- shadcn/ui Components
- Radix UI Primitives

</td>
<td>

**Backend**

- Appwrite (Auth, DB, Storage)
- Next.js API Routes
- Server-side Proxy

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Appwrite instance (cloud or self-hosted)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/getman.git
   cd getman
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure your `.env.local`:

   ```env
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Configure Appwrite**

   - Create a new Appwrite project
   - Set up the required database collections (see [Database Schema](#database-schema))
   - Configure authentication providers

5. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Database Schema

### Collections Required in Appwrite:

#### `api_requests`

| Field       | Type     | Description        |
| ----------- | -------- | ------------------ |
| `userId`    | String   | User ID reference  |
| `name`      | String   | Request name       |
| `method`    | String   | HTTP method        |
| `url`       | String   | API endpoint       |
| `headers`   | JSON     | Request headers    |
| `body`      | String   | Request body       |
| `createdAt` | DateTime | Creation timestamp |

#### `api_collections`

| Field            | Type     | Description        |
| ---------------- | -------- | ------------------ |
| `userId`         | String   | Owner user ID      |
| `collectionName` | String   | Collection name    |
| `requests`       | Array    | Request IDs        |
| `createdAt`      | DateTime | Creation timestamp |

#### `api_history`

| Field          | Type     | Description         |
| -------------- | -------- | ------------------- |
| `userId`       | String   | User ID             |
| `requestData`  | JSON     | Original request    |
| `responseData` | JSON     | Response data       |
| `status`       | Integer  | HTTP status code    |
| `responseTime` | Integer  | Response time (ms)  |
| `createdAt`    | DateTime | Execution timestamp |

#### `shared_collections` & `shared_requests`

For the sharing feature - see [SHARING_FEATURE.md](./SHARING_FEATURE.md) for details.

---

## 🎮 Usage

### 1. **Authentication**

- Sign up or log in using email/password
- Secure authentication powered by Appwrite

### 2. **Making Requests**

- Select HTTP method (GET, POST, PUT, DELETE, etc.)
- Enter your API endpoint URL
- Add headers using the smart autocomplete
- Include request body for POST/PUT requests
- Click **Send** to execute

### 3. **Managing Collections**

- Create collections to organize related requests
- Drag and drop requests between collections
- Share entire collections with public links

### 4. **Viewing Responses**

- **Pretty** - Formatted JSON with syntax highlighting
- **Raw** - Raw response data
- **Headers** - Response headers in key-value format

### 5. **Sharing**

- Share individual requests or entire collections
- Generate public links that expire in 30 days
- No authentication required for viewers

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Using Turbopack (faster builds)
npm run dev          # Already uses --turbopack flag
npm run build        # Uses --turbopack for faster builds
```

### Project Structure

```
getman/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── proxy/         # Request proxy endpoint
│   │   └── share/         # Sharing functionality
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   └── shared/            # Public shared content
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── contexts/             # React contexts
```

---

## 🏛️ Architecture

```
User Interface (Next.js + React)
         ↓
   Authentication Layer (Appwrite)
         ↓
   API Proxy (Next.js API Routes)
         ↓
   External APIs ← → Database (Appwrite)
```

### Request Flow

1. **User Input** → Request Builder UI
2. **Authentication** → Appwrite validates user session
3. **Proxy Layer** → Next.js `/api/proxy` handles CORS and security
4. **External API** → Request forwarded to target endpoint
5. **Response Processing** → Data formatted and displayed
6. **Storage** → Request/response saved to Appwrite database

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible components
- **[Radix UI](https://www.radix-ui.com/)** - Low-level UI primitives
- **[Appwrite](https://appwrite.io/)** - Backend-as-a-Service platform
- **[Lucide](https://lucide.dev/)** - Beautiful icons
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

---

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/sagardev09/getman/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/sagardev09/getman/discussions)
- 📧 **Email**: official.sagar.dev@gmail.com

---

<div align="center">

**Made with ❤️ for the API testing community**

[⭐ Star on GitHub](https://github.com/sagardev09/getman) •

</div>
