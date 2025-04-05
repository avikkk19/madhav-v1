import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function AIChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState('gemini-2.0-flash');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const API_KEY = import.meta.env.VITE_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);

  const models = [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', icon: 'G' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', icon: 'G' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', icon: 'C' },
    { id: 'gpt-4o', name: 'GPT-4o', icon: 'GPT' }
  ];

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage = { role: 'user', content: inputValue };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      let responseText = '';
      
      if (currentModel.startsWith('gemini')) {
        // Handle Gemini models
        const model = genAI.getGenerativeModel({ model: currentModel });
        const result = await model.generateContent(inputValue);
        responseText = result.response.text();
      } else if (currentModel.startsWith('claude')) {
        // Placeholder for Claude API integration
        responseText = "This is a simulated Claude response. In a real implementation, you would integrate with the Claude API.";
      } else if (currentModel.startsWith('gpt')) {
        // Placeholder for OpenAI API integration
        responseText = "This is a simulated GPT response. In a real implementation, you would integrate with the OpenAI API.";
      }
      
      // Add AI response to messages
      const aiResponse = { 
        role: 'assistant', 
        content: responseText,
        model: currentModel
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: 'Sorry, there was an error processing your request.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const getModelName = (modelId) => {
    const model = models.find(m => m.id === modelId);
    return model ? model.name : modelId;
  };

  const getModelIcon = (modelId) => {
    const model = models.find(m => m.id === modelId);
    return model ? model.icon : '?';
  };

  const toggleModelDropdown = () => {
    setShowModelDropdown(!showModelDropdown);
  };

  const selectModel = (modelId) => {
    setCurrentModel(modelId);
    setShowModelDropdown(false);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-gray-200">
      {/* Header */}
      <header className="border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 text-white">
              <span className="bg-gray-600 text-xs w-full h-full rounded-full flex items-center justify-center">
                {getModelIcon(currentModel)}
              </span>
            </div>
            <h1 className="text-xl font-medium">{getModelName(currentModel)}</h1>
          </div>
          <div className="flex items-center space-x-2">
            {/* Add header controls if needed */}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-16">
              <div className="w-8 h-8 text-white mb-6">
                <span className="bg-gray-600 text-xs w-full h-full rounded-full flex items-center justify-center">
                  {getModelIcon(currentModel)}
                </span>
              </div>
              <h2 className="text-3xl font-semibold mb-4">Hi there, madhav</h2>
              <p className="text-gray-400 max-w-md">
                What would you like to know?
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-2xl">
                <div className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 cursor-pointer">
                  <div className="text-sm text-gray-400">Write a to-do list for a personal project or task</div>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 cursor-pointer">
                  <div className="text-sm text-gray-400">Generate an email response to a job offer</div>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 cursor-pointer">
                  <div className="text-sm text-gray-400">Summarize this article or text for me in one paragraph</div>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 cursor-pointer">
                  <div className="text-sm text-gray-400">How does AI work in a technical capacity</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {messages.map((message, index) => (
                <div key={index} className="my-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full mr-2 flex items-center justify-center">
                      {message.role === 'user' ? (
                        <span className="bg-gray-600 text-xs w-full h-full rounded-full flex items-center justify-center">
                          U
                        </span>
                      ) : (
                        <span className="bg-gray-600 text-xs w-full h-full rounded-full flex items-center justify-center">
                          {getModelIcon(message.model || currentModel)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-400 text-sm mb-1">
                        {message.role === 'user' ? 'You' : getModelName(message.model || currentModel)}
                      </div>
                      <div className="text-gray-200 whitespace-pre-wrap">
                        {formatMessage(message.content)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="my-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full mr-2 flex items-center justify-center">
                      <span className="bg-gray-600 text-xs w-full h-full rounded-full flex items-center justify-center">
                        {getModelIcon(currentModel)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-400 text-sm mb-1">
                        {getModelName(currentModel)}
                      </div>
                      <div className="text-gray-200 flex items-center">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-zinc-700">
        <div className="max-w-4xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={inputRef}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 pr-24 min-h-12 resize-none focus:outline-none focus:border-gray-500"
              placeholder="Ask whatever you want..."
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleModelDropdown}
                className="p-2 rounded-full hover:bg-zinc-700 text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
              <button
                type="submit"
                disabled={inputValue.trim() === '' || isLoading}
                className={`p-2 rounded-full ${
                  inputValue.trim() === '' || isLoading
                    ? 'text-gray-500'
                    : 'text-blue-400 hover:text-blue-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </form>
          
          {/* Model selection dropdown */}
          {showModelDropdown && (
            <div className="absolute bottom-16 right-3 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg w-60 z-10">
              <div className="p-2">
                <div className="text-sm font-medium text-gray-300 mb-2">Select model</div>
                {models.map((model) => (
                  <div 
                    key={model.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer ${
                      currentModel === model.id ? 'bg-zinc-700' : 'hover:bg-zinc-700'
                    }`}
                    onClick={() => selectModel(model.id)}
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                      <span className="text-xs">{model.icon}</span>
                    </div>
                    <span className="text-sm">{model.name}</span>
                    {currentModel === model.id && (
                      <svg className="w-4 h-4 ml-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-2">
            <div className="flex items-center space-x-2">
              <button className="text-sm text-gray-500 hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <button className="text-sm text-gray-500 hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <span>All web</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for typing indicator */}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        .typing-indicator span {
          height: 6px;
          width: 6px;
          margin: 0 2px;
          background-color: #60a5fa;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          } 40% { 
            transform: scale(1.0);
          }
        }
      `}</style>
    </div>
  );
}

export default AIChatInterface;