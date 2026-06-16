import {client} from '../tina/__generated__/client'
import { TinaMarkdown } from "tinacms/dist/rich-text"

// getting the Contact Page TinaCMS information / fields
export async function getStaticProps(){
    try{
        // get total count first (pattern used elsewhere in the repo)
        const countResp = await client.request({
            query: `{ contactsConnection { totalCount } }`,
        })

        const total = countResp.data?.contactsConnection?.totalCount || 0

        // querying Tina for the Contact page
        const { data } = await client.request({
            query: `
            query getContacts($count: Float) {
              contactsConnection(first: $count) {
                edges {
                    node {
                    name
                    role
                    order
                    contact_methods { type value }
                    description
                    _sys { filename }
                  }
                }
              }
            }
            `,
            variables: { count: total },
        })

        // getting the contacts info and sorting them by order
        const contacts = (data?.contactsConnection?.edges || [])
                        .map(e => e.node)
                        .sort((a, b) => {
                            const orderA = typeof a.order === 'number' ? a.order : 9999
                            const orderB = typeof b.order === 'number' ? b.order : 9999

                            if (orderA !== orderB) return orderA - orderB

                            return (a.role || '').localeCompare(b.role || '')
                        })

        return {
            props: { contacts },
            revalidate: 60,
        }
    }catch(err){
        console.error('Tina query failed', err)
        return { props: { contacts: [] } }
    }

}

export default function Contact({ contacts }){
    return (
        <main className="w-full bg-black text-white">
            <div className="w-full px-8 pb-10 md:px-16">
                <h1 className="mb-12 font-kallisto text-6xl font-normal text-white">
                Contacts
                </h1>

                <section className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {contacts.map((c, i) => (
                    <article key={i} className="w-[320px] min-h-[360px] border-2 border-[#e0ff05] bg-black p-8 text-white" >
                        <h2 className="mb-8 text-4xl font-extrabold leading-tight text-[#e0ff05]">
                            {c.role}
                        </h2>
                        <p className="mb-6 font-bold">{c.name}</p>
                        <div className="mb-8 space-y-1">
                            {c.contact_methods?.map((m, j) => (
                                <p key={j} className="leading-relaxed">
                                            {m.type}:{" "}
                                        {/* if contains @ then display it as email*/}
                                        {m.value.includes("@") 
                                        ? (
                                            <a href={`mailto:${m.value}`} className="text-blue-300 underline">
                                                {m.value}
                                            </a>
                                        ) 
                                        : (m.value)}

                                </p>
                            ))}
                        </div>

                        <div className="whitespace-pre-line text-base prose prose-invert max-w-none prose-p:text-gray-200 prose-p:leading-relaxed prose-strong:font-extrabold 
                            prose-strong:font-black prose-em:text-[#e0ff05] prose-em:italic 
                            prose-a:text-blue-300 prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4"
                        >
                            <TinaMarkdown content={c.description} />
                        </div>
                    </article>
                ))}
            </section>
            </div>
        </main>
    );
}
