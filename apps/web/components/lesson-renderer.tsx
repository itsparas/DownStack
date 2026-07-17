import type { Block } from "@downstack/content";
import {
  Prose,
  MentorNote,
  WarStory,
  Pitfall,
  MentalModel,
  Takeaways,
  Divider,
  Predict,
  Quiz,
  DeepDive,
} from "@downstack/ui";
import { CodeBlock } from "./code-block";
import { slugify } from "@/lib/slug";

/**
 * Server component. The block union in @downstack/content is the pedagogy;
 * this file is just the wiring. Interactive blocks (Predict, Quiz, DeepDive)
 * are client components — everything else renders to static HTML.
 */
export function LessonRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "prose":
            return (
              <div key={i} className="my-6 space-y-5">
                <Prose md={block.md} />
              </div>
            );
          case "heading":
            return (
              <h2
                key={i}
                id={slugify(block.text)}
                className="mb-4 mt-14 scroll-mt-24 font-display text-2xl font-bold tracking-tight text-chalk"
              >
                <span aria-hidden className="mr-3 text-chalkfaint/50">
                  §
                </span>
                {block.text}
              </h2>
            );
          case "code":
            return (
              <CodeBlock
                key={i}
                language={block.language}
                code={block.code}
                filename={block.filename}
                caption={block.caption}
              />
            );
          case "mentor":
            return <MentorNote key={i} md={block.md} />;
          case "warstory":
            return <WarStory key={i} title={block.title} md={block.md} />;
          case "pitfall":
            return <Pitfall key={i} title={block.title} md={block.md} />;
          case "model":
            return <MentalModel key={i} title={block.title} md={block.md} />;
          case "predict":
            return (
              <Predict key={i} question={block.question} reveal={block.reveal} />
            );
          case "deepdive":
            return (
              <DeepDive key={i} title={block.title} md={block.md}>
                {block.code && (
                  <CodeBlock
                    language={block.code.language}
                    code={block.code.code}
                    filename={block.code.filename}
                  />
                )}
              </DeepDive>
            );
          case "quiz":
            return <Quiz key={i} question={block.question} options={block.options} />;
          case "takeaways":
            return <Takeaways key={i} items={block.items} />;
          case "divider":
            return <Divider key={i} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
