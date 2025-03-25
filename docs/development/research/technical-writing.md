# Tech Writing Best Practices

![image.png](/img/meme-tech.png)

Documenting the code, protocols and models we work with is a key part of a project's succeed. Any stray confusion, or misused phrase, might send people down the wrong path. If you’ve worked in software, you know how quickly a tiny misunderstanding can balloon into a huge chaos. That’s where technical writing comes in. It’s this practice of wrangling complexity into clarity —distilling volumes of detail into instructions even a newcomer can follow. **We care about ensuring that what we build can be used without confusion.**

# Core Principles

## Know the audience

Who’s reading this? Researchers? Developers? Each group has different backgrounds. Tailor your language accordingly. If you’re writing for deeply technical folks, skip the basics. If your readers are new, give them ample definitions and examples so they can form the right mental model.

## Use active voice

Prefer *“The user does the transaction”* to *“The transaction is done by the user.”* Active voice shows **who** is doing **what**, cutting clutter and building clarity—perfect for any instructions.

## No fluff

Avoid empty words like *“It is important to note...”* or *“opens up possibilities.”* If it’s truly important, your specifics will prove that without padding. Let your writing echo what’s at stake rather than bury it. If a word is ambiguous, replace it. No room here for “maybe” or “sort of.”

## Structure for readability

Use **headers**, **bullet points**, and **short paragraphs**. Readers can skim key steps without feeling they’re rummaging through a labyrinth. 

## Step-by-Step, not an avalanche

Code runs in a logical sequence—your writing should, too. Keep the order clear, from start to finish. If you have to reference a later section, leave a roadmap so nobody panics searching for the missing pieces.

## Define new or unfamiliar terms

**Don’t let readers stumble into the dark.** If you introduce a term, clarify it right away or link to a resource (no need to reinvent the wheel). Collect multiple definitions in a glossary if your document has a bunch of fresh jargon.

## Stay consistent with terms

Don’t rename something halfway through—people will wonder if it’s a different concept altogether. Once you call it *“Optimism Rollup Cluster”,* don’t suddenly switch to “*Superchain”*. Consistency is the difference between smooth comprehension and user confusion.

## Use acronyms properly

On the first mention, **bold** the full term and put the acronym in parentheses—**Layer 2 (L2)**. After that, you can use L2 throughout. If you only use an acronym a couple of times, consider skipping it altogether; too many acronyms weigh on the reader’s mental load.

## Recognize ambiguous pronouns

Pronouns (like *it*, *they*, *this*) can be as slippery as eels. If there’s any risk that *it* could mean more than one thing, restate your noun. Consider reading your doc from the perspective of a brand-new user. **If you can’t pinpoint the pronoun’s reference in a second or two, rephrase.**

## Choose strong verbs

Words like *is*, *are*, *occur*, and *happen* are often placeholders. Try dynamic verbs that paint a clear action:

- **Weak**: “A runtime error occurs when we pass invalid data.”
- **Strong**: “Invalid data **triggers** a runtime error.”

## Avoid *There Is / There Are*

Remove those beginnings to make sentences more direct. Compare:

- **Weak**: “There are many reasons to adopt this approach.”
- **Better**: “You have many reasons to adopt this approach.”

## Keep Sentences & paragraphs manageable

Too long? Break it up. A big, chunky paragraph is an easy place for crucial info to get lost —don’t write more than three sentences in one paragraph, unless it’s necessary. And if you’re piling up run-on sentences, you risk burying your main point.

## Use effective argumentation

Avoid blanket statements like “X is better” or “Y is worse” without data or a clear rationale. Present your reasoning or evidence—give the “why” behind your claim. If comparisons are involved, support them with references or metrics so readers can see the facts.

## Quantify when possible

Steer clear of vague terms like “far,” “too much,” or “too little.” Whenever you can, use specific metrics or numbers. For instance, say “We reduced memory usage from 512MB to 256MB,” instead of “We saved a lot of memory.” Concrete data anchors your claims in measurable reality.

## Provide references

Reference relevant materials—whether they’re academic papers, blog posts, or internal docs. Attach links or citations where appropriate. If you mention an existing standard or best practice, guide the reader to it. Let them dig deeper if they choose.

## Not all can be explained with plain words!

A picture is worth a thousand words. Utilize the resources available to you. Most text editors let you add pictures, tables, code snippets, and diagrams — the use of Figma, Excalidraw or Mermaid is allowed!

![image.png](/img/tech-writing-meme-2.png)

Before shipping an article, ask yourself: have I included enough memes, diagrams, and references? Then you are ready to send it.

# Great Examples

https://aztec.network/blog/the-best-of-both-worlds-how-aztec-blends-private-and-public-state - By **Lisa A.**

https://dev.to/spalladino/a-beginners-intro-to-coding-zero-knowledge-proofs-c56 - By Santiago Palladino.

https://medium.com/connext/optimistic-bridges-fb800dc7b0e0

# Resources

https://www.rareskills.io/post/technical-writing-checklist

https://developers.google.com/tech-writing

https://mirror.xyz/lisaakselrod.eth/3VJ6t85bpn58WrxrBtVggDIv8-foJJjOys1Tu6K6EfU