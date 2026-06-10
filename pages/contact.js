export async function getStaticProps(){
    const query = `{
        getContactsList {
            edges{
                node{
                    name
                    role
                    order
                    contact_methods { type value }
                    _body
                }
            }
        }
    }`;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/___tina`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ query })
    })

    const bodyText = await res.text();
    console.log('Fetch status', res.status, 'body preview:', bodyText.slice(0,300));
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${bodyText.slice(0,200)}`);
    const json = JSON.parse(bodyText);
    const contacts = json?.data?.getContactsList?.edges.map(e => e.node) || [];
    return { props: { contacts }};
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
            <div>{c._body}</div> {/* MDX body; render with MDX if desired */}
            </section>
        ))}
        </main>
  );
}