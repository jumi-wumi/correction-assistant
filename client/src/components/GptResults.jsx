import React from 'react'
import ReactMarkdown from 'react-markdown';

// Pass response as prop
const GptResults = ({ response }) => {
  return (
    <div className="result">
      <ReactMarkdown>{response}</ReactMarkdown>
    </div>  )
}

export default GptResults