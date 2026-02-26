import { NextRequest, NextResponse } from "next/server";
import { getDirectusClient } from "@/core/lib/directus";
import {
  readItems,
  readItem,
  createItem,
  updateItem,
  deleteItem,
} from "@directus/sdk";

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const [collection, id] = path;

  if (!collection) {
    return NextResponse.json({ error: "Collection required" }, { status: 400 });
  }

  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());

  // Parse directus query params from URL
  const query: Record<string, unknown> = {};
  if (searchParams.fields) query.fields = searchParams.fields.split(",");
  if (searchParams.filter) query.filter = JSON.parse(searchParams.filter);
  if (searchParams.sort) query.sort = searchParams.sort.split(",");
  if (searchParams.limit) query.limit = Number(searchParams.limit);
  if (searchParams.offset) query.offset = Number(searchParams.offset);
  if (searchParams.search) query.search = searchParams.search;
  if (searchParams.page) query.page = Number(searchParams.page);

  try {
    let result;
    const directus = getDirectusClient();
    switch (req.method) {
      case "GET": {
        if (id) {
          result = await directus.request(readItem(collection, id, query));
        } else {
          result = await directus.request(readItems(collection, query));
        }
        break;
      }

      case "POST": {
        const body = await req.json();
        result = await directus.request(createItem(collection, body));
        break;
      }

      case "PATCH": {
        if (!id) {
          return NextResponse.json({ error: "ID required for update" }, { status: 400 });
        }
        const body = await req.json();
        result = await directus.request(updateItem(collection, id, body));
        break;
      }

      case "DELETE": {
        if (!id) {
          return NextResponse.json({ error: "ID required for delete" }, { status: 400 });
        }
        await directus.request(deleteItem(collection, id));
        return new NextResponse(null, { status: 204 });
      }

      default:
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    return NextResponse.json({ data: result });
  } catch (error: unknown) {
    console.error(`Directus error [${req.method} /${collection}]:`, error);
    const status = (error as { status?: number })?.status ?? 500;
    const message = (error as { message?: string })?.message ?? "Internal server error";
    return NextResponse.json({ error: message }, { status });
  }
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;