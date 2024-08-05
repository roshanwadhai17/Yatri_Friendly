package com.yatrifriendly.usersmanagementsystem.service;

import com.yatrifriendly.usersmanagementsystem.dto.ReqRes;
import com.yatrifriendly.usersmanagementsystem.dto.TransactionRequest;
import com.yatrifriendly.usersmanagementsystem.entity.Company;
import com.yatrifriendly.usersmanagementsystem.entity.OurUsers;
import com.yatrifriendly.usersmanagementsystem.entity.Transaction;
import com.yatrifriendly.usersmanagementsystem.repository.CompanyRepository;
import com.yatrifriendly.usersmanagementsystem.repository.TransactionRepository;
import com.yatrifriendly.usersmanagementsystem.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UsersManagementService {

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ReqRes register(ReqRes registrationRequest) {
        ReqRes resp = new ReqRes();

        Optional<OurUsers> existingUser = usersRepo.findByEmail(registrationRequest.getEmail());
        if (existingUser.isPresent()) {
            resp.setStatusCode(400);
            resp.setMessage("User with this email already exists");
            return resp;
        }

        Company company = registrationRequest.getCompany();
        if (company != null) {
            company = companyRepository.save(company);
        }

        try {
            OurUsers ourUser = new OurUsers();
            ourUser.setEmail(registrationRequest.getEmail());
            ourUser.setCity(registrationRequest.getCity());
            ourUser.setRole("USER");
            ourUser.setRole(registrationRequest.getRole());
            ourUser.setFirstName(registrationRequest.getFirstName());
            ourUser.setLastName(registrationRequest.getLastName());
            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            ourUser.setActive(true);
            ourUser.setCompany(company);
            ourUser.setUsername(ourUser.getEmail());
            ourUser.setDateOfRegistration(LocalDate.now());
            ourUser.setPhoneNumber(registrationRequest.getPhoneNumber());
            ourUser.setType(registrationRequest.getType());

            OurUsers ourUsersResult = usersRepo.save(ourUser);
            if (ourUsersResult.getId() > 0) {
                resp.setOurUsers(ourUsersResult);
                resp.setMessage("User Saved Successfully");
                resp.setStatusCode(200);
            }

        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public ReqRes login(ReqRes loginRequest) {
        ReqRes response = new ReqRes();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            OurUsers user = usersRepo.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + loginRequest.getEmail()));

            String jwt = jwtUtils.generateToken(user);
            String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.getRole());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully Logged In");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public ReqRes refreshToken(ReqRes refreshTokenRequest) {
        ReqRes response = new ReqRes();
        try {
            String userEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            OurUsers user = usersRepo.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), user)) {
                String jwt = jwtUtils.generateToken(user);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Refreshed Token");
            }
            return response;

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    public ReqRes getAllUsers() {
        ReqRes reqRes = new ReqRes();

        try {
            List<OurUsers> result = usersRepo.findAll();
            if (!result.isEmpty()) {
                reqRes.setOurUsersList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes getUsersById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(id);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("User with id '" + id + "' found successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for id: " + id);
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes deleteUser(Integer userId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updateUser(Integer userId, OurUsers updatedUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                OurUsers existingUser = userOptional.get();

                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setFirstName(updatedUser.getFirstName());
                existingUser.setLastName(updatedUser.getLastName());
                existingUser.setCity(updatedUser.getCity());
                existingUser.setRole(updatedUser.getRole());
                existingUser.setDateOfRegistration(updatedUser.getDateOfRegistration());
                existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
                existingUser.setType(updatedUser.getType());

                Company company = updatedUser.getCompany();
                if (company != null) {
                    company = companyRepository.save(company);
                }
                existingUser.setCompany(company);

                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                OurUsers savedUser = usersRepo.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes getMyInfo(String email) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("User info retrieved successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes addTransaction(Integer userId, TransactionRequest transactionRequest) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                OurUsers user = userOptional.get();

                // Create a new Transaction entity and populate it
                Transaction transaction = new Transaction();
                transaction.setDate(LocalDate.parse(transactionRequest.getDate()));
                transaction.setAmount(transactionRequest.getAmount());
                transaction.setTransactionId(transactionRequest.getTransactionId());

                // Associate the transaction with the user
                transaction.setUser(user);

                // Save the transaction
                Transaction savedTransaction = transactionRepository.save(transaction);

                // Add the transaction to the user's list of transactions
                if (user.getTransactions() == null) {
                    user.setTransactions(List.of(savedTransaction));
                } else {
                    user.getTransactions().add(savedTransaction);
                }

                // Update the user with the new transaction
                usersRepo.save(user);

                reqRes.setStatusCode(200);
                reqRes.setMessage("Transaction added successfully");
                reqRes.setTransactions(List.of(savedTransaction)); // Return only the saved transaction
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while adding transaction: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes getAllTransactions(Integer userId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                List<Transaction> transactions = userOptional.get().getTransactions();
                if (transactions != null && !transactions.isEmpty()) {
                    reqRes.setTransactions(transactions); // Set transactions in response
                    reqRes.setStatusCode(200);
                    reqRes.setMessage("Transactions retrieved successfully");
                } else {
                    reqRes.setStatusCode(404);
                    reqRes.setMessage("No transactions found for this user");
                }
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while retrieving transactions: " + e.getMessage());
        }
        return reqRes;
    }

}
