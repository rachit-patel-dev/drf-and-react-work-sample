import jwt
from typing import List, Any, Dict
from datetime import datetime, timedelta
from domain_driven_api.domain.user.models import User
from utils.django.exceptions import VerifyTokenDataException
from domain_driven_api.infrastructure.logger.models import AttributeLogger


class UserAccessToken:
    """
    The UserAccessToken class represents a user access token generator and verifier.

    Attributes:
        exp (int): The expiration time of the access token in minutes.
        key (str): The secret key used for encoding and decoding the access token.
        log (AttributeLogger): An instance of the AttributeLogger class used for logging.

    Methods:
        generate_token(user: User, data: Dict[str, Any] = {}) -> str:
            Generates an access token for the given user with optional additional data.

        verify_token_by_user(encoded_token: str, user: User) -> bool:
            Verifies if the given access token is valid for the specified user.

        verify_token(encoded_token: str) -> dict:
            Verifies the given access token and returns the decoded token data.

    Raises:
        VerifyTokenDataException: If there is an error while verifying the access token data.

    """

    def __init__(self, exp, key, log: AttributeLogger) -> None:
        self.exp = exp
        self.key = key
        self.log = log

    def generate_token(self, user: User, data: Dict[str, Any] = {}) -> str:
        expiration_time = datetime.utcnow() + timedelta(minutes=self.exp)
        token_data = (
            dict(
                id=str(user.id),
                email=user.email,
                username=user.username,
                exp=expiration_time,
            )
            if data == {}
            else data
        )
        token_data.update({"exp": expiration_time})
        access_token = jwt.encode(payload=token_data, key=self.key)
        return access_token

    def verify_token_by_user(self, encoded_token: str, user: User) -> bool:
        decoded_token = jwt.decode(
            encoded_token,
            self.key,
            algorithms=["HS256"],
            verify_exp=True,
        )
        if not (
            decoded_token.get("email") == user.email
            and decoded_token.get("username") == user.username
            and user.is_active == True
        ):
            return False
        return True

    def verify_token(self, encoded_token: str) -> dict:
        try:
            decoded_token_data = jwt.decode(
                encoded_token,
                self.key,
                algorithms=["HS256"],
                verify_exp=True,
            )
            return decoded_token_data
        except Exception as e:
            raise VerifyTokenDataException(
                "verify-token-data-exception", str(e), self.log
            )
