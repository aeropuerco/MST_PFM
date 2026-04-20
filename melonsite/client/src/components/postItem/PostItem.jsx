import postitemStyle from './PostItem.module.css'

export const PostItem = ({id, title, autor, exerpt, date}) => {

    return (
        <div className={postitemStyle.item} data-id={id}>

                    <div className={postitemStyle.title}>{title}</div>
                    <div className={postitemStyle.autor}>{autor}</div>
                    <div className={postitemStyle.exerpt}>{exerpt}</div>
                    <div className={postitemStyle.date}>{date}</div>
                
        </div>
    )
}
