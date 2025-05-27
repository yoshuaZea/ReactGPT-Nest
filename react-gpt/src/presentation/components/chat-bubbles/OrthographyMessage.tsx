interface Props {
  userScore: number;
  errors: string[];
  message: string;
}

export const OrthographyMessage = ({ userScore, errors, message }: Props) => {
  return (
    <div className="col-start-1 col-end-9 px-3 rounded-lg">
      <div className="flex flex-row items-start">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-500 text-white font-bold flex-shrink-0">
          G
        </div>
        <div className="relative ml-3 text-sm bg-yellow-50 pt-3 pb-2 px-4 shadow rounded-xl">
          <h3>Puntaje: {userScore}</h3>
          <p>{message}</p>
          {
            errors.length === 0
              ? <p>No se encontraron errores, perfecto!</p>
              : (
                <>
                  <h3 className="text-2xl">Errores encontrados</h3>
                  <ul>
                    {
                      errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))
                    }
                  </ul>
                </>
              )
          }
        </div>
      </div>
    </div>
  )
}
