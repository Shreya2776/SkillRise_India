import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, Paperclip, X, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const ChatUI = () => {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim() && !selectedFile) return;

    const userMessage = input || "Uploaded my resume";

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);

    setInput("");
    setLoading(true);
    setLoadingText("Thinking...");

    try {
      const formData = new FormData();

      if (input.trim()) formData.append("message", input.trim());
      if (threadId) formData.append("threadId", threadId);
      formData.append("userId", "local-test-user");

      if (selectedFile) {
        formData.append("resume", selectedFile);
      }

      removeFile();

      const response = await fetch("http://localhost:5002/api/chatbot/message", {
        method: "POST",
        body: formData
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        const lines = chunk.split("\n");

        for (const line of lines) {

          if (line.startsWith("data: ")) {

            const data = JSON.parse(line.replace("data: ", ""));

            if (data.type === "progress") {
              setLoadingText(data.message);
            }

            if (data.type === "complete") {

              assistantText += data.reply;

              setMessages((prev) => {
                const updated = [...prev];
                updated.push({
                  role: "assistant",
                  content: assistantText,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                });
                return updated;
              });

              if (data.threadId) setThreadId(data.threadId);

            }
          }
        }
      }

    } catch (err) {

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error connecting to AI server",
          isError: true
        }
      ]);

    }

    setLoading(false);
  };

  const CodeBlock = ({ node, inline, className, children }) => {

    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || "");

    const copyCode = () => {
      navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (!inline) {
      return (
        <div className="relative my-4">

          <button
            onClick={copyCode}
            className="absolute top-2 right-2 text-xs bg-gray-800 px-2 py-1 rounded flex items-center gap-1"
          >
            {copied ? <Check size={14}/> : <Copy size={14}/> }
          </button>

          <SyntaxHighlighter
            style={oneDark}
            language={match?.[1] || "javascript"}
            PreTag="div"
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>

        </div>
      );
    }

    return (
      <code className="bg-gray-800 px-1 py-0.5 rounded text-green-400">
        {children}
      </code>
    );
  };

  return (

    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black px-4">

      <div className="flex flex-col w-full max-w-4xl h-[92vh] bg-gray-900/70 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}

        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-800">

          <div className="p-2 bg-blue-600/10 rounded-lg">
            <Bot className="text-blue-400"/>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg">
              Agentic Career Assistant
            </h2>
            <p className="text-xs text-gray-400">
              AI powered career guidance
            </p>
          </div>

        </div>

        {/* CHAT */}

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">

              <Bot size={50} className="mb-4 text-blue-400"/>

              <p className="max-w-md text-center">
                Ask about skills, careers, or upload your resume to start.
              </p>

            </div>
          )}

          {messages.map((msg, i) => (

            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>

              {msg.role === "assistant" && (
                <Bot className="mr-3 text-blue-400"/>
              )}

              <div className={`max-w-[75%] p-4 rounded-2xl ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 border border-gray-700 text-gray-200"
              }`}>

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: CodeBlock
                  }}
                >
                  {msg.content}
                </ReactMarkdown>

                <div className="text-xs text-gray-400 mt-2">
                  {msg.timestamp}
                </div>

              </div>

              {msg.role === "user" && (
                <User className="ml-3 text-gray-300"/>
              )}

            </div>

          ))}

          {loading && (
            <div className="flex items-center gap-3 text-gray-400">
              <Loader2 className="animate-spin"/>
              {loadingText}
            </div>
          )}

          <div ref={messagesEndRef}/>

        </div>

        {/* INPUT */}

        {/* INPUT */}

<div className="border-t border-gray-800 p-4 bg-gray-900/80 backdrop-blur">

        {selectedFile && (
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg mb-3 w-fit border border-gray-700">
            <Paperclip size={14}/>
            <span className="text-sm text-gray-300">{selectedFile.name}</span>

            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-red-400"
            >
              <X size={14}/>
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-3 w-full"
        >

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />

          {/* Upload Button */}

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 p-3 rounded-xl transition flex-shrink-0"
          >
            <Paperclip size={18}/>
          </button>


          {/* TEXTAREA */}

          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              autoResizeTextarea();
            }}
            placeholder="Ask anything about your career..."
            className="
            flex-1
            w-full
            resize-none
            bg-gray-800
            border border-gray-700
            rounded-xl
            px-4
            py-3
            text-white
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            max-h-40
            overflow-y-auto
            "
          />


          {/* SEND BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
            bg-blue-600
            hover:bg-blue-500
            transition
            p-3
            rounded-xl
            flex-shrink-0
            disabled:opacity-50
            "
          >
            <Send size={18}/>
          </button>

        </form>

      </div>

      </div>

    </div>

  );
};

export default ChatUI;