import CountryInformation from './components/countryInformation';
import ClientProvider from './components/clientProvider';
import generateRandomNumber from '@/utils/generateRandomNumber';
import Faq from './components/faq/faq';

async function getCountries() {
  // As new countries are generated by refreshing the page, we need to opt ut caching so new data is fetched
  const res = await fetch(
    'https://restcountries.com/v3.1/all?fields=name,capital,flags,currencies,continents,languages,population',
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Error fetching data');
  }

  return res.json();
}

export default async function Home() {
  const countries = await getCountries();
  const randomNumber = generateRandomNumber();

  return (
    <main className='flex flex-col items-center px-2 md:px-0'>
      <ClientProvider country={countries[randomNumber]}>
        {/* Server component  */}
        <CountryInformation country={countries[randomNumber]} />
      </ClientProvider>
      <Faq />
    </main>
  );
}
