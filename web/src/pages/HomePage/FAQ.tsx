export const FAQ = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <h1 className="text-5xl font-semibold title-font text-center text-base-content mb-20">FAQ's
        </h1>
        <div className="grid grid-cols-1 md:grid-cold-2 lg:grid-cols-2 gap-4 place-items-center">
          <FAQBlock
            title={'How do credits work?'}
            answer={'Each question/response pair costs approximately 1 credit.' +
              ' This can vary slightly depending on the length of the question and response but is usually accurate. ' +
              ' You can see how many credits you have left on your profile dashbord.'}
          />
          <FAQBlock
            title={'Is there a free account?'}
            answer={'We offer a free trial of 10 credits. This is enough to test out the platform and see if it works for you.'}
          />
          <FAQBlock
            title={'When are my credits renewed'}
            answer={'your credits are renewed every month on the date you signed up. ' +
              'For example, if you signed up on the 15th of the month, your credits will be renewed on the 15th of each month.' +
              ' you can see your next renewal date on your profile dashboard.'}
          />
          <FAQBlock title={'If you have any other questions, please reach out on LinkedIn'} answer={
            <>
              <a target={'_blank'} className={'text-primary'} href={'https://www.linkedin.com/in/kye-moon-134b90187/'}>Kye moon</a>
            </>
          }/>
        </div>
      </div>
    </section>
  )
}


export const FAQBlock = ({title, answer}) => {
  return (
    <div className="p-4 w-full flex">
      <div className="flex-grow pl-6">
        <h2 className="text-2xl text-base-content title-font font-medium mb-2">{title}</h2>
        <p className="leading-relaxed text-base">{answer}</p>
      </div>
    </div>
  )
}
