
export const ContentBlock = ({ tipo, children}) => {


        switch(tipo){

        case 'parrafo':
            return (
                <p>
                    {children}
                </p>
             )
       

        case 'imagen':
            return (
                <div background-image={children}></div>
             )

        case 'subtitulo':
            return (
                 <h2>{children}</h2>
            )

        case 'code':
            return (
                <div className="block_code">{children}</div>
           )
        


        default:
            return (
                <div>
                    {children}
                </div>
            )

        

    
}

}