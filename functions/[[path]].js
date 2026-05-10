import axios from "axios";
      name,
      position,
      viewKey: generateKey(16),
      deleteKey: generateKey(),
      joined: new Date().toISOString(),
      ip,
      risk,
      registered: false
    };

    users.set(id, user);

    return json(user);
  }

  // USER ROUTE
  if (path.startsWith("/user/")) {
    const id = path.split("/")[2];
    const key = url.searchParams.get("key");

    const user = users.get(id);

    if (!user) {
      return json({ error: "Invalid or expired ID" }, 404);
    }

    if (key !== user.viewKey) {
      return json({ error: "Invalid key" }, 403);
    }

    return json(user);
  }

  // REGISTER ROUTE
  if (path.startsWith("/register/")) {
    const id = path.split("/")[2];

    const user = users.get(id);

    if (!user) {
      return json({ error: "Invalid or expired ID" }, 404);
    }

    user.registered = true;

    return json(user);
  }

  // DELETE ROUTE
  if (path.startsWith("/delete/")) {
    const id = path.split("/")[2];
    const key = url.searchParams.get("key");

    const user = users.get(id);

    if (!user) {
      return json({ error: "User not found" }, 404);
    }

    if (key !== user.deleteKey) {
      return json({ error: "Invalid key" }, 403);
    }

    users.delete(id);

    const remainingUsers = [...users.values()].sort(
      (a, b) => a.position - b.position
    );

    remainingUsers.forEach((u, index) => {
      u.position = index + 1;
    });

    return json({
      success: true,
      deletedId: id,
      users: remainingUsers
    });
  }

  return json({ error: "Not found" }, 404);
}
