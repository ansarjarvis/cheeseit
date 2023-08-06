import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { z } from "zod";

export let PATCH = async (req: Request) => {
  try {
    let body = await req.json();
    let { name } = UsernameValidator.parse(body);

    let session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    /* check if username is already taken */

    let username = await db.user.findFirst({
      where: {
        username: name,
      },
    });

    if (username) {
      return new Response("Username is already taken", { status: 409 });
    }

    /*  update username */

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      },
    });

    return new Response("okey");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not update username at this time. Please try later",
      { status: 500 }
    );
  }
};
