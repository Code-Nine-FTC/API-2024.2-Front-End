import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaCalendarAlt } from 'react-icons/fa';
import '../date/DatePickerStyles.css';


const Calendario = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    return (
        <>
        <div>
            <Form.Group controlId="formDate">
                <Form.Label>Escolha uma data inicial e final</Form.Label>
                    <InputGroup className='mb-3'>
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date | null) => setStartDate(date)}
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Data Inicial"
                            showYearDropdown
                            scrollableMonthYearDropdown
                            selectsStart
                            startDate={startDate || undefined}
                            endDate={endDate || undefined}
                        />
                        <InputGroup.Text>
                            <FaCalendarAlt />
                        </InputGroup.Text>
                    </InputGroup>
            <br />
                    <InputGroup className='mb-3'>
                        <DatePicker
                            selected={endDate}
                            onChange={(date: Date | null) => setEndDate(date)}
                            className="form-control"
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
