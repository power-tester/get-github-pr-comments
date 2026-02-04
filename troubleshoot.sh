#!/bin/bash

echo "🔍 MCP Server Troubleshooting Script"
echo "===================================="
echo ""

# Check if config file exists
CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
echo "1. Checking Claude Desktop config..."
if [ -f "$CONFIG_FILE" ]; then
    echo "✅ Config file exists"
    echo ""
    echo "Current configuration:"
    cat "$CONFIG_FILE" | python3 -m json.tool 2>/dev/null || cat "$CONFIG_FILE"
else
    echo "❌ Config file not found at: $CONFIG_FILE"
    echo ""
    echo "Create it with:"
    echo "mkdir -p \"$HOME/Library/Application Support/Claude\""
    echo "cat > \"$CONFIG_FILE\" << 'EOF'"
    echo '{'
    echo '  "mcpServers": {'
    echo '    "github-pr-comments": {'
    echo '      "command": "node",'
    echo '      "args": ['
    echo "        \"$(pwd)/build/index.js\""
    echo '      ]'
    echo '    }'
    echo '  }'
    echo '}'
    echo 'EOF'
fi

echo ""
echo "2. Checking if build exists..."
if [ -f "$(pwd)/build/index.js" ]; then
    echo "✅ Built server found at: $(pwd)/build/index.js"
else
    echo "❌ Build not found. Run: npm run build"
fi

echo ""
echo "3. Checking GitHub CLI..."
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI installed"
    gh auth status 2>&1 | head -3
else
    echo "❌ GitHub CLI not installed. Run: brew install gh"
fi

echo ""
echo "4. Testing server directly..."
echo "Running: echo '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\"}' | node $(pwd)/build/index.js"
echo ""
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node "$(pwd)/build/index.js" 2>&1 | head -20

echo ""
echo "===================================="
echo "📋 Next Steps:"
echo "1. Make sure the config file has the correct path"
echo "2. Restart Claude Desktop completely (Cmd+Q, then reopen)"
echo "3. Look for 🔌 icon in Claude Desktop - should show 'github-pr-comments'"
echo "4. Check logs: tail -f ~/Library/Logs/Claude/mcp*.log"
