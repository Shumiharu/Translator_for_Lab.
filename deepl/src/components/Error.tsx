import style from '../stylesheets/error.module.css'

export const Error = () => {
  return(
    <>
       <div style={{textAlign: 'center', marginTop: '120px'}}>
        <div style={{color: '#49ddc2', fontSize: '80px', fontWeight: 'bold'}}>404</div>
        <div style={{color: '#49ddc2', fontSize: '20px', fontWeight: 'bold'}}>SORRY, NOT FOUND</div>
      </div>
    </>
  )
}