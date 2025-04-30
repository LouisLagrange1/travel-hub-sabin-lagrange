import { SearchForm } from "@/components/search-form";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold">
          Découvrez le monde avec TravelHub
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Trouvez les meilleures offres pour vos voyages, hôtels et activités en
          quelques clics.
        </p>
      </section>

      <section>
        <SearchForm />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
        <div className="text-center space-y-2">
          <div className="bg-blue-100 text-blue-600 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Destinations Mondiales</h3>
          <p className="text-gray-600">
            Des centaines de destinations à découvrir partout dans le monde.
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="bg-blue-100 text-blue-600 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Meilleurs Prix</h3>
          <p className="text-gray-600">
            Nous comparons les prix pour vous offrir les meilleures offres.
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="bg-blue-100 text-blue-600 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Service Fiable</h3>
          <p className="text-gray-600">
            Un service client disponible 24/7 pour vous accompagner.
          </p>
        </div>
      </section>

      <section className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Destinations Populaires</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/offers?from=PAR&to=NYC"
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold">Paris → New York</h3>
            <p className="text-sm text-gray-600">À partir de 450€</p>
          </a>
          <a
            href="/offers?from=PAR&to=TYO"
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold">Paris → Tokyo</h3>
            <p className="text-sm text-gray-600">À partir de 750€</p>
          </a>
          <a
            href="/offers?from=PAR&to=SYD"
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold">Paris → Sydney</h3>
            <p className="text-sm text-gray-600">À partir de 950€</p>
          </a>
          <a
            href="/offers?from=PAR&to=CPT"
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold">Paris → Le Cap</h3>
            <p className="text-sm text-gray-600">À partir de 650€</p>
          </a>
        </div>
      </section>
    </div>
  );
}
