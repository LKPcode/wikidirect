import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { description: string } } // Ensure `params` is awaited properly
) {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
    params.description
  )}&format=json`;

  try {
    // Step 1: Fetch search results from Wikipedia
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    // Step 2: Extract the title of the first search result
    const firstResult = searchData?.query?.search?.[0]?.title;

    if (firstResult) {
      // Step 3: Fetch the page's main image using the PageImages API
      const pageImageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        firstResult
      )}&prop=pageimages&piprop=original&format=json`;

      const imageResponse = await fetch(pageImageUrl);
      const imageData = await imageResponse.json();

      // Extract the image URL
      const pages = imageData?.query?.pages;
      const firstPage = Object.values(pages)?.[0];
      const imageUrl = (
        firstPage as unknown as { original: { source: string } }
      )?.original?.source;

      if (imageUrl) {
        // Redirect to the most relevant image
        return NextResponse.redirect(imageUrl);
      }
    }

    // If no image is found, redirect to the placeholder image
    return NextResponse.redirect("http://localhost:3000/image.png");
  } catch {
    // Handle errors in fetching or processing data
    return NextResponse.json(
      { error: "An error occurred while fetching data from Wikipedia." },
      { status: 500 }
    );
  }
}
