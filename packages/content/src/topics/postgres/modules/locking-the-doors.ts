import type { Module } from "../../../types";

/** Field — security as engineering: who may do what, enforced by the database. */
export const lockingTheDoors: Module = {
  slug: "locking-the-doors",
  title: "Locking the doors",
  description:
    "Security the database can enforce for you: roles and grants that give each connection only what it needs, and policies that make cross-tenant reads impossible.",
  lessons: [
    {
      slug: "roles-and-grants",
      title: "Roles and GRANT: who may do what",
      hook: "Your app connects as a superuser right now, doesn't it? Least privilege, role-based access, and the migration-user pattern.",
      depth: "field",
      minutes: 20,
      status: "soon",
      blocks: [],
    },
    {
      slug: "row-level-security",
      title: "Row-level security: WHERE with teeth",
      hook: "One policy makes it impossible for tenant A to read tenant B's rows — even on the day your app code forgets the filter.",
      depth: "field",
      minutes: 22,
      status: "soon",
      blocks: [],
    },
    {
      slug: "injection-and-blast-radius",
      title: "SQL injection and blast radius",
      hook: "Parameterized queries stop the classic attack; your GRANTs decide how bad it gets on the day someone forgets.",
      depth: "field",
      minutes: 18,
      status: "soon",
      blocks: [],
    },
  ],
};
