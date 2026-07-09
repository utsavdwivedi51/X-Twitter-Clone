# 𝕏 - Social Media Platform

A fully functional Twitter/X clone built with vanilla HTML, CSS, and JavaScript. This single-page application replicates the core features of a modern social media platform with a dark theme and responsive design.

##  Table of Contents
- [Features](#-features)
- [Demo](#-demo)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Features in Detail](#-features-in-detail)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

##  Features

### Core Functionality
- **User Authentication** - Sign up, sign in, and guest mode
- **Post Creation** - Compose tweets with text, images, and videos
- **Feed Management** - For You and Following tabs
- **Interactions** - Like, repost, reply, and bookmark posts
- **User Profiles** - Customizable profiles with bio, banner, and avatar
- **Direct Messages** - Real-time chat interface with auto-replies
- **Notifications** - Like, follow, repost, and mention alerts
- **Explore Page** - Discover trending content by category
- **Search** - Search tweets and users across the platform

### User Experience
- **Dark Theme** - Modern dark UI with accent colors
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Keyboard Shortcuts** - Ctrl/Cmd + Enter to post
- **Media Support** - Upload and view images and videos
- **Character Counter** - 280-character limit with visual feedback
- **Toast Notifications** - Real-time feedback for actions
- **Modal Dialogs** - Clean popups for compose and image viewing

##  Demo

### Live Preview
The application runs entirely in your browser with localStorage for data persistence.

### Test Accounts
- **Guest Mode**: Click "Continue as Guest" to try instantly
- **Test Users**: Create your own account or use seed data

##  Installation

### Prerequisites
- Any modern web browser (Chrome, Firefox, Edge, Safari)
- Local server (optional - works with file:// protocol)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/x-clone.git
cd x-clone
```

2. **Open the application**
```bash
# Simply open index.html in your browser
open index.html
# OR use a local server
npx serve .
```

3. **Start using**
- Sign up for a new account
- Or click "Continue as Guest" to explore immediately

### File Structure
```
x-clone/
├── index.html          # Main HTML structure
├── style.css           # All styles and theming
├── script.js           # Complete application logic
└── README.md           # This file
```

##  Usage

### Getting Started

1. **Sign Up**
   - Click "Create Account" tab
   - Fill in your details
   - Upload a profile photo (optional)
   - Click "Create Account"

2. **Log In**
   - Enter your username/email and password
   - Click "Sign In"
   - Or use "Continue as Guest" for instant access

### Main Features

#### Posting
1. Click the text area "What is happening?!"
2. Type your post (up to 280 characters)
3. Add media via the 🖼️ button
4. Click "Post" or use Ctrl/Cmd + Enter

#### Interacting
- **Like** ❤️ - Click the heart icon
- **Repost** 🔁 - Click the retweet button
- **Reply** 💬 - Click the comment icon or use the reply button
- **Bookmark** 🔖 - Click the share/bookmark icon

#### Navigation
- **Home** 🏠 - Main feed with For You/Following tabs
- **Explore** 🔍 - Discover trending content
- **Notifications** 🔔 - View likes, follows, and mentions
- **Messages** ✉️ - Direct messages with users
- **Bookmarks** 🔖 - Saved posts
- **Profile** 👤 - Your profile and posts

##  Project Structure

### Architecture

```
├── Authentication Layer
│   ├── Sign Up / Sign In
│   ├── Guest Mode
│   └── Session Management
├── UI Components
│   ├── Sidebar Navigation
│   ├── Feed & Tweets
│   ├── Compose Box
│   ├── Right Sidebar
│   └── Modals
└── Data Layer
    ├── localStorage
    ├── Seed Data
    └── State Management
```

### Key Components

**HTML**: Semantic structure with clear component separation
**CSS**: Custom properties for theming, responsive layouts, animations
**JavaScript**: Vanilla JS with localStorage persistence, modular functions

##  Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, flexbox, grid, animations
- **Vanilla JavaScript** - ES6+ features
- **localStorage** - Client-side data persistence
- **FileReader API** - Image and video uploads
- **Font Awesome** - Iconography (via emoji)

##  Features in Detail

### Authentication System
- Local storage user management
- Profile photo upload
- Guest mode access
- Session persistence

### Tweet Engine
- 280-character limit with visual counter
- Media support (images/videos)
- Rich text with hashtags and mentions
- Real-time updates

### Social Features
- Like/repost/bookmark counts
- Following system with personalized feeds
- User mentions and notifications
- Direct messaging with auto-replies

### Profile Management
- Customizable bio, location, website
- Profile and banner photo upload
- Activity stats (posts, followers, following)
- Media gallery view

### Responsive Design
- Mobile-optimized sidebar
- Adaptive layout for tablets and desktop
- Touch-friendly interactions
- Smooth animations and transitions

##  Screenshots

### Home Feed
![Home Feed](https://via.placeholder.com/600x400?text=Home+Feed)

### Profile Page
![Profile Page](https://via.placeholder.com/600x400?text=Profile+Page)

### Messages
![Messages](https://via.placeholder.com/600x400?text=Messages)

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Maintain consistent code style
- Test features thoroughly before committing
- Update documentation as needed
- Keep the single-file structure intact (HTML + CSS + JS separation)

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- Inspired by Twitter/X's UI/UX
- Uses Google Fonts for typography
- Built with vanilla web technologies

##  Support

For support, email utsavdwivedi51@gmail.com or open an issue on GitHub.

---

**Made with ❤️ by Utsav Dwivedi**

*Note: This is a front-end demonstration project. All data is stored locally in your browser's localStorage and will persist between sessions.*
