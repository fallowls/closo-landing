import React from "react";

export default function Landing() {
  return (
    <div 
      className="bg-black min-h-screen"
      dangerouslySetInnerHTML={{ 
        __html: `
<!doctype html>
<html lang="en-US">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Closo - Intelligent Automation</title>
    <style>
      body { margin: 0; background: black; overflow: hidden; }
      iframe { border: none; width: 100vw; height: 100vh; }
    </style>
</head>
<body>
    <iframe 
      src="https://xtract.framer.ai/" 
      style="width:100%; height:100vh; border:none;"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
    ></iframe>
</body>
</html>
` 
      }} 
    />
  );
}
