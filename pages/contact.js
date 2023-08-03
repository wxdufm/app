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
      <div className="flex flex-col h-full justify-center items-center text-black pb-10 ">
        <form 
            className="bg-neutral-500 bg-opacity-25 p-6 rounded-2xl w-2/5"
            id="contactForm"
            // action="/api/submit-form"
            // method="POST"
        >
          <h1 className="kallisto text-2xl text-center text-white">Reach Out To Us!</h1>
          <div className="flex flex-col mb-5">
            <div className="mb-2"><label className="text-white">Your Name</label></div>
            <input
              className="border-0 rounded-md px-2 py-2 bg-white bg-opacity-75"
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              required
            />
          </div>
          <div className="flex flex-col mb-5">
          <div className="mb-2"><label className="text-white" htmlFor="organization">Organization</label></div>
            <textarea
              className="border-0 rounded-md px-2 py-2 bg-white bg-opacity-75"
              id="organization"
              rows="5"
              placeholder="Tell us about your organization! (optional)"
              
            ></textarea>
          </div>
          <div className="flex flex-col mb-5">
          <div className="mb-2"><label className="text-white"  htmlFor="message">Message</label></div>
            <textarea
              className="border-0 rounded-md px-2 py-2 bg-white bg-opacity-75"
              name="message"
              id="message"
              rows="5"
              placeholder="Submit a PSA, question, or comment."
              required
            ></textarea>
          </div>
          <button className="bg-neutral-700" style={{padding: "0.5rem 1rem", border: "none", color: "white", fontSize: "1rem", fontWeight: "bold", borderRadius: "4px", boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)", cursor: "pointer"}} type="submit">
            Submit
          </button>
        </form>
        {isSubmitted && <p>Thanks!</p>}
      </div>
    );
  }

