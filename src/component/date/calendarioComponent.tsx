import React, { Dispatch, SetStateAction, useState } from 'react';
import DatePicker from 'react-datepicker';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaCalendarAlt } from 'react-icons/fa';
import '../date/DatePickerStyles.css';

interface CalendarioProps {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
}
const Calendario: React.FC<CalendarioProps> = ({ startDate, endDate, setStartDate, setEndDate }) => {

    // Função para lidar com mudanças de data, convertendo 'null' para 'undefined', porque a merda da biblioteca retorna 'null' ao invés de 'undefined'
    //const handleStartDateChange = (date: Date | null) => {
    //    setStartDate(date);
    //};

    //const handleEndDateChange = (date: Date | null) => {
    //    setEndDate(date);
    //};


    return (
        <>
        <div>
            <Form.Group controlId="formDate">
                    <InputGroup className='mb-3'>
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date | null) => setStartDate(date)}
                            className="form-control custom-datepicker"
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Data Inicial"
                            showYearDropdown
                            scrollableMonthYearDropdown
                            selectsStart
                            startDate={startDate || undefined}
                            endDate={endDate || undefined}
                            maxDate={endDate || undefined}
                        />
                        <InputGroup.Text>
                            <FaCalendarAlt />
                        </InputGroup.Text>
                    </InputGroup>

                    <InputGroup className='mb-3'>
                        <DatePicker
                            selected={endDate}
                            onChange={(date: Date | null) => setEndDate(date)}
                            className="form-control custom-datepicker"
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Data Final"
                            selectsEnd
                            showYearDropdown
                            scrollableMonthYearDropdown
                            startDate={startDate || undefined}
                            endDate={endDate || undefined}
                            minDate={startDate || undefined}
                        />
                        <InputGroup.Text>
                            <FaCalendarAlt />
                        </InputGroup.Text>
                    </InputGroup>
            </Form.Group>
        </div>
        </>
    )
}
export default Calendario
