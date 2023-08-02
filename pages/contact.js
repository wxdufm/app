import { useState, useEffect } from "react";

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const form = document.getElementById('contactForm');
    
        const handleSubmit = async (event) => {
          event.preventDefault(); 
    
          const formData = new FormData(form);
          const formDataJson = JSON.stringify(Object.fromEntries(formData));
    
          try {
            const response = await fetch('/api/submit-form', {
              method: 'POST',
              body: formDataJson,
              headers: {
                'Content-Type': 'application/json',
              },
            });
    
            if (response.ok) {
              console.log('Form submitted successfully');
              setIsSubmitted(true);
            } else {
              console.log('Form submission failed');
            }
          } catch (error) {
            console.error('Error submitting form', error);
          }
        };
    
        form.addEventListener('submit', handleSubmit);
    
        return () => {
          form.removeEventListener('submit', handleSubmit);
        };
      }, []);


    return (
      <div className="flex flex-col h-full justify-center items-center text-black">
        <form 
            className="bg-white p-6 rounded-lg w-2/5"
            id="contactForm"
            // action="/api/submit-form"
            // method="POST"
        >
          <h1 style={{margin: "0 0 1.5rem", color: "black"}}>React Out To Us</h1>
          <div>
            <label style={{display: "block", textTransform: "uppercase", fontSize: "0.9rem", marginBorrom: "0.5rem", color: "#334155"}} htmlFor="name">Name</label>
            <input
              style={{width: "100%", border: "none", background: "#f4f4f5", padding: "0.75rem 0.5rem", fontSize: "1rem", marginBottom: "1.25rem", borderRadius: "4px"}}
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              required
            />
          </div>
          <div className="flex-1">
            <label style={{display: "block", textTransform: "uppercase", fontSize: "0.9rem", marginBorrom: "0.5rem", color: "#334155"}} htmlFor="organization">Organization</label>
            <textarea
              style={{width: "100%", border: "none", background: "#f4f4f5", padding: "0.75rem 0.5rem", fontSize: "1rem", marginBottom: "1.25rem", borderRadius: "4px"}}
              name="organization"
              id="organization"
              rows="5"
              placeholder="Tell us about your organization!"
              required
            ></textarea>
          </div>
          <div className="flex-1">
            <label style={{display: "block", textTransform: "uppercase", fontSize: "0.9rem", marginBorrom: "0.5rem", color: "#334155"}} htmlFor="message">Message</label>
            <textarea
              style={{width: "100%", border: "none", background: "#f4f4f5", padding: "0.75rem 0.5rem", fontSize: "1rem", marginBottom: "1.25rem", borderRadius: "4px"}}
              name="message"
              id="message"
              rows="5"
              placeholder="PSA Message"
              required
            ></textarea>
          </div>
          <button className="bg-pink-800" style={{padding: "0.5rem 1rem", border: "none", color: "white", fontSize: "1rem", fontWeight: "bold", borderRadius: "4px", boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)", cursor: "pointer"}} type="submit">
            Submit
          </button>
        </form>
        {isSubmitted && <p>Thanks!</p>}
      </div>
    );
  }

