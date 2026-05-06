//CSS
import EditableContentBlockStyle from './EditableContentBlock.module.css'

export const EditableContentBlock = ({ block, index, onChange, onRemove}) => {

    const blockBody = () => {

        switch(block.tipo){

        case 'parrafo':
            return (
                <textarea 
                    className={EditableContentBlockStyle.textBox}
                    value={block.valor} 
                    placeholder="Escribe un parrafo" 
                    onChange={(e) => onChange(index, e.target.value)} />
             )
       

        case 'imagen':
            return (
                <input type="text"
                className={EditableContentBlockStyle.imgInput}
                    value={block.valor} 
                    placeholder="URL de la imagen,,,"
                    onChange={(e) => onChange(index, e.target.value)}/>
             )

        case 'subtitulo':
            return (
                <input type="text"
                className={EditableContentBlockStyle.subtitleinput}
                value={block.valor} 
                placeholder="Añade un Subtitulo"
                onChange={(e) => onChange(index, e.target.value)}/>
            )

        case 'codigo':
            return (
                <textarea
                className={EditableContentBlockStyle.codeBox}
                value={block.valor} 
                placeholder="Escribe un fragmento de código" 
                onChange={(e) => onChange(index, e.target.value)} />
           )
        


        default:
            return (
                <textarea 
                value={block.valor} 
                placeholder="Escribe un texto" 
                onChange={(e) => onChange(index, e.target.value)} />
            )

        
        }
    
    }

    return (

        <>
            <div className={EditableContentBlockStyle.block_header}>
                    <label>Bloque: <strong>{block.tipo}</strong></label>
                    <button className='mel_button' type="button" onClick={() => onRemove(index)}>Eliminar</button>
            </div>
            <div className="block-body">
                {blockBody()}
            </div>
        </>
    )

}