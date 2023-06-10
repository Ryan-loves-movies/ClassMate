import findSimilar from "@sqlite/modulesController";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const [limit, query] = [parseInt(searchParams.get("limit") as string), searchParams.get("query") as string];

    const searchRes = await findSimilar(query, limit)
        .then((models) => {
            return models.map((model) => model.toJSON());
        });
    console.log(searchRes);

    return NextResponse.json(searchRes);
}
