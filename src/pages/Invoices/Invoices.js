import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Container from '@mui/material/Container';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useLocation } from 'react-router-dom';

import { deleteInvoice, getInvoicesByUser } from '../../actions/invoiceActions';
import NoData from '../../components/svgIcons/NoData';
import Spinner from '../../components/Spinner/Spinner';
import { useSnackbar } from 'react-simple-snackbar';
import { Box } from '@mui/material';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'>
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'>
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'>
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'>
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const tableStyle = {
  width: 160,
  fontSize: 14,
  cursor: 'pointer',
  borderBottom: 'none',
  padding: '8px',
  textAlign: 'center',
};
const headerStyle = { borderBottom: 'none', textAlign: 'center' };

const Invoices = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'));
  const rows = useSelector((state) => state.invoices.invoices);
  const isLoading = useSelector((state) => state.invoices.isLoading);
  // eslint-disable-next-line
  const [openSnackbar, closeSnackbar] = useSnackbar();

  useEffect(() => {
    dispatch(
      getInvoicesByUser({ search: user?.result?._id || user?.result?.sub })
    );
    // eslint-disable-next-line
  }, [location]);

  const toCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rows.length);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const editInvoice = (id) => {
    history(`/edit/invoice/${id}`);
  };

  const openInvoice = (id) => {
    history(`/invoice/${id}`);
  };

  if (!user) {
    history('/login');
  }

  function checkStatus(status) {
    return status === 'Partial'
      ? {
          border: 'solid 0px #1976d2',
          backgroundColor: '#baddff',
          padding: '8px 18px',
          borderRadius: '20px',
        }
      : status === 'Paid'
      ? {
          border: 'solid 0px green',
          backgroundColor: '#a5ffcd',
          padding: '8px 18px',
          borderRadius: '20px',
        }
      : status === 'Unpaid'
      ? {
          border: 'solid 0px red',
          backgroundColor: '#ffaa91',
          padding: '8px 18px',
          borderRadius: '20px',
        }
      : 'red';
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          paddingTop: '20px',
        }}>
        <Spinner />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          paddingTop: '20px',
          margin: '80px',
        }}>
        <NoData />
        <p style={{ padding: '40px', color: 'gray', textAlign: 'center' }}>
          No invoice yet. Click the plus icon to create invoice
        </p>
      </div>
    );
  }

  return (
    <div>
      <Container
        style={{
          width: '85%',
          paddingTop: '70px',
          paddingBottom: '50px',
          border: 'none',
        }}>
        <TableContainer component={Paper} elevation={0}>
          <Table
            sx={{
              minWidth: 500,
            }}
            aria-label='custom pagination table'>
            <TableHead>
              <TableRow>
                <TableCell style={headerStyle}>Number</TableCell>
                <TableCell style={headerStyle}>Client</TableCell>
                <TableCell style={headerStyle}>Amount</TableCell>
                <TableCell style={headerStyle}>Due Date</TableCell>
                <TableCell style={headerStyle}>Status</TableCell>
                <TableCell style={headerStyle}>Edit</TableCell>
                <TableCell style={headerStyle}>Delete</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((row) => (
                <TableRow key={row._id} style={{ cursor: 'pointer' }}>
                  <TableCell
                    style={tableStyle}
                    onClick={() => openInvoice(row._id)}>
                    {' '}
                    {row.invoiceNumber}{' '}
                  </TableCell>
                  <TableCell
                    style={tableStyle}
                    onClick={() => openInvoice(row._id)}>
                    {' '}
                    {row.client.name}{' '}
                  </TableCell>
                  <TableCell
                    style={tableStyle}
                    onClick={() => openInvoice(row._id)}>
                    {row.currency} {row.total ? toCommas(row.total) : row.total}{' '}
                  </TableCell>
                  <TableCell
                    style={tableStyle}
                    onClick={() => openInvoice(row._id)}>
                    {' '}
                    {moment(row.dueDate).fromNow()}{' '}
                  </TableCell>
                  <TableCell
                    style={tableStyle}
                    onClick={() => openInvoice(row._id)}>
                    {' '}
                    <button style={checkStatus(row.status)}>
                      {row.status}
                    </button>
                  </TableCell>

                  <TableCell style={{ ...tableStyle, width: '10px' }}>
                    <IconButton onClick={() => editInvoice(row._id)}>
                      <BorderColorIcon
                        style={{ width: '20px', height: '20px' }}
                      />
                    </IconButton>
                  </TableCell>
                  <TableCell style={{ ...tableStyle, width: '10px' }}>
                    <IconButton
                      onClick={() =>
                        dispatch(deleteInvoice(row._id, openSnackbar))
                      }>
                      <DeleteOutlineRoundedIcon
                        style={{ width: '20px', height: '20px' }}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={6}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default Invoices;
