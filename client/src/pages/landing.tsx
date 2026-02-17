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
    <title>Xtract - AI automation agency framer template</title>
    <style>
      body { margin: 0; background: black; }
      iframe { border: none; width: 100vw; height: 100vh; }
    </style>
</head>
<body>
    <iframe src="/xtract/xtract.framer.ai/index.html" style="width:100%; height:100vh; border:none;"></iframe>
</body>
</html>
` 
      }} 
    />
  );
}
