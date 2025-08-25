# 21st Extension Toolbar Setup

This project has been configured with the 21st Extension Toolbar for enhanced development experience.

## 🚀 Quickstart

### 1. Install the Code Editor Extension
- **VS Code**: Install from VS Code Marketplace or Extensions tab
- **Cursor/Windsurf**: Install from Extensions tab or manually from Open VSX
- **Other editors**: Look for "21st Extension" in your editor's extension marketplace

### 2. Toolbar Installation ✅
The toolbar has been automatically installed and configured:

```bash
pnpm i -D @21st-extension/toolbar
```

### 3. Auto-Install the Toolbar (AI-guided)
In Cursor:
1. Press `CMD + Shift + P` (or `Ctrl + Shift + P` on Windows)
2. Enter `setupToolbar`
3. Execute the command and the toolbar will init automatically 🦄

## 📁 Files Added/Modified

- `src/utils/toolbar.ts` - Dedicated toolbar configuration
- `src/main.tsx` - Toolbar initialization on app startup
- `package.json` - Added `@21st-extension/toolbar` dependency

## ⚙️ Configuration

The toolbar is configured in `src/utils/toolbar.ts`:

```typescript
const stagewiseConfig = {
  plugins: [],
  // Add more configuration options as needed
};
```

## 🔧 Development Mode Only

The toolbar only initializes in development mode (`import.meta.env.DEV`), so it won't appear in production builds.

## 🚫 Troubleshooting

### If nothing happens when a prompt is sent:
- Keep only one Cursor window open when using stagewise
- The toolbar may send prompts to the wrong window if multiple windows are open

### Check Console
Look for these messages in your browser console:
- ✅ `🎉 21st Extension Toolbar initialized successfully!`
- ❌ `Failed to initialize 21st Extension Toolbar: [error]`

## 🎯 Usage

Once set up, the toolbar will automatically connect to the extension and provide enhanced AI capabilities for your development workflow.

## 📚 More Information

- [21st Extension Documentation](https://21st-extension.com)
- [Framework-specific packages](https://21st-extension.com/frameworks)
- [Troubleshooting Guide](https://21st-extension.com/troubleshooting)
