import styles from '../component/home/Home.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const Home = () => {
    return (
        <body>
            <header>
                <h1 className={styles.home}>NavBar</h1>  {/* Método provisório */}
            </header>
            <main className={styles.flex_box}>
                <section>
                    <form className={styles.form_box}>
                        <div className={styles.form_format} >
                            <div>
                                <label htmlFor="startDate" className="form-label">Data Inicial</label>
                                <input type="date" className="form-control" id="startDate"/>
                            </div>
                            <div >
                                <label htmlFor="endDate" className="form-label">Data Final</label>
                                <input type="date" className="form-control" id="endDate"/>
                            </div>
                            <input className={styles.form} type="text" placeholder="Coordenador" />
                            <input type="text" placeholder="Referência do Projeto" />
                            <input type="text" placeholder="Classificação" />
                            <input type="text" placeholder="Situação do Projeto" />
                            <button type="submit" value="Procurar">Procurar</button>
                        </div>
                    </form>
                </section>
                <aside className={styles.projects_box}>
                    <ul>
                        <li className={styles.projects_list}><a href="#">Projeto-Titulo</a></li>
                        <li className={styles.projects_list}><a href="#">Projeto-Titulo</a></li>
                        <li className={styles.projects_list}><a href="#">Projeto-Titulo</a></li>
                        <li className={styles.projects_list}><a href="#">Projeto-Titulo</a></li>
                        <li className={styles.projects_list}><a href="#">Projeto-Titulo</a></li>
                        <li className={styles.projects_list}><a href="#">Projeto-Titulo</a></li>
                        <li className={styles.projects_list}><a href="#">Projeto-Titulo</a></li>
                        <li className={styles.projects_list}><a href="#">Projeto-Titulo</a></li>
                        <li className={styles.projects_list}><a href="#">Projeto-Titulo</a></li>
                    </ul>
                </aside>
            </main>
        </body>
    )
}

export default Home