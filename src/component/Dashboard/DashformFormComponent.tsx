import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DashboardFormComponent: React.FC = () => {
    return (
      <div className="container">
        <h2 className="text-center my-4">Dashboard</h2>
        <div className="card shadow-sm p-4" style={{ borderRadius: '10px' }}>
          <form>
            <div className="form-group row mb-4">
              <label htmlFor="projectReference" className="col-sm-3 col-form-label">Referência do projeto:</label>
              <div className="col-sm-9">
                <input type="text" className="form-control" id="projectReference" />
              </div>
            </div>
            <div className="form-group row mb-4">
              <label htmlFor="coordinator" className="col-sm-3 col-form-label">Coordenador:</label>
              <div className="col-sm-9">
                <input type="text" className="form-control" id="coordinator" />
              </div>
            </div>
            <div className="form-group row mb-4">
              <label htmlFor="startDate" className="col-sm-3 col-form-label">Data de início:</label>
              <div className="col-sm-3">
                <div className="input-group">
                  <input type="text" className="form-control" id="startDate" defaultValue="02/01/2021" />
                  <span className="input-group-text"><i className="bi bi-calendar"></i></span>
                </div>
              </div>
              <label htmlFor="endDate" className="col-sm-3 col-form-label">Data de término:</label>
              <div className="col-sm-3">
                <div className="input-group">
                  <input type="text" className="form-control" id="endDate" defaultValue="08/07/2021" />
                  <span className="input-group-text"><i className="bi bi-calendar"></i></span>
                </div>
              </div>
            </div>
            <div className="form-group row mb-4">
              <label htmlFor="minValue" className="col-sm-3 col-form-label">Valor mínimo:</label>
              <div className="col-sm-3">
                <input type="text" className="form-control" id="minValue" />
              </div>
              <label htmlFor="maxValue" className="col-sm-3 col-form-label">Valor máximo:</label>
              <div className="col-sm-3">
                <input type="text" className="form-control" id="maxValue" />
              </div>
            </div>
            <div className="form-group row mb-4">
              <label htmlFor="projectStatus" className="col-sm-3 col-form-label">Situação do projeto:</label>
              <div className="col-sm-9">
                <select className="form-select" id="projectStatus">
                  <option>Em andamento</option>
                  <option>Concluído</option>
                  <option>Cancelado</option>
                  <option>Em espera</option>
                </select>
              </div>
            </div>
            <div className="form-group row mb-4">
              <label htmlFor="searchType" className="col-sm-3 col-form-label">Tipo de busca:</label>
              <div className="col-sm-9">
                <select className="form-select" id="searchType">
                  <option>Quantidade de projetos criados por mês</option>
                  <option>Quantidade de projetos concluídos por mês</option>
                  <option>Quantidade de projetos cancelados por mês</option>
                  <option>Quantidade de projetos em espera por mês</option>
                </select>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-12 text-center">
                <button type="button" className="btn btn-secondary">Gerar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default DashboardFormComponent;