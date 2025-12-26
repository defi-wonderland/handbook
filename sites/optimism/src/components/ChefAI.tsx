import AskCookbook from '@cookbookdev/docsbot/react'

/** It's a public API key, so it's safe to expose it here */
const COOKBOOK_PUBLIC_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWQ0ZTRiODcwYzRiNzY0NjgzM2FjNjMiLCJpYXQiOjE3MDg0NTEwMDAsImV4cCI6MjAyNDAyNzAwMH0.mXXkSNOIFPtX-fQcBZeJZlRvHQhh812DaJkLhuE44d4";

export default function ChefAI() {
  return (
    <>
     <AskCookbook apiKey={COOKBOOK_PUBLIC_API_KEY} /> 
    </>
  );
}