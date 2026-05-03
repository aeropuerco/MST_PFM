//CSS
import contentBlockStyle from './ContentBlock.module.css'


export const ContentBlock = ({ tipo, children}) => {


        switch(tipo){

        case 'parrafo':
            return (
                <p className={contentBlockStyle.parrafo}>
                    {children}
                </p>
             )
       

        case 'imagen':
            return (
                <div className={contentBlockStyle.imagen} style={{backgroundImage: `url(${children})`}} ></div>
             )

        case 'subtitulo':
            return (
                 <h2 className={contentBlockStyle.subtitulo}>{children}</h2>
            )

        case 'codigo':
            return (
                <div className={contentBlockStyle.code}>{children}</div>
           )
        


        default:
            return (
                <div>
                    {children}
                </div>
            )

        

    
}

}