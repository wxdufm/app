import {client} from '../tina/__generated__/client'

export async function getStaticProps(){
    try{
        // get total count first (pattern used elsewhere in the repo)
        const countResp = await client.request({
            query: `{ contactsConnection { totalCount } }`,
        })

        const total = countResp.data?.contactsConnection?.totalCount || 0

        const { data } = await client.request({
            query: `
            query getContacts($count: Float) {
              contactsConnection(first: $count, sort: "order") {
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

        const contacts = (data?.contactsConnection?.edges || []).map(e => e.node)

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
        <main>
        <h1>Contacts</h1>
        {contacts.map((c, i) => (
            <section key={i}>
            <h2>{c.name}</h2>
            <div>{c.role}</div>
            <div>
                {c.contact_methods?.map((m, j) => <div key={j}>{m.type}: {m.value}</div>)}
            </div>
            <div>{typeof c.description === 'string' ? c.description : JSON.stringify(c.description || '')}</div>
            </section>
        ))}
        </main>
  );
}