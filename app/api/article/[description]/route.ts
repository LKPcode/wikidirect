import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { description: string } }
) {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
    params.description
  )}&format=json`;

  try {
    // Fetch search results from Wikipedia
    const response = await fetch(searchUrl);
    const data = await response.json();

    // Extract the title of the first search result
    const firstResult = data?.query?.search?.[0]?.title;

    if (firstResult) {
      // Redirect to the most relevant Wikipedia article
      const articleUrl = `https://wikipedia.org/wiki/${encodeURIComponent(
        firstResult
      )}`;
      return NextResponse.redirect(articleUrl);
    } else {
      // Handle case where no results are found
      return NextResponse.json(
        { error: "No articles found for the given description." },
        { status: 404 }
      );
    }
  } catch {
    // Handle errors in fetching or processing data
    return NextResponse.json(
      { error: "An error occurred while searching Wikipedia." },
      { status: 500 }
    );
  }
}
