from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient,force_authenticate
from rest_framework import status


CREATE_ACL = reverse('acl-list')

def get_user(account_type,email):
    params = {
        "email":email,
        "password":"User@1234",
        "is_active":True,
        "account_type":account_type,
        "first_name":"John",
        "last_name":"Doe",
        "phone":"9829487",
    }
    return get_user_model().objects.create(**params)

class PrivateACLTest(TestCase):
    
    def setUp(self) -> None:
        self.client = APIClient()
        return super().setUp()

    def get_authenticated_user(self,account_type,email):
        user = get_user(account_type=account_type,email=email)
        self.client.force_authenticate(user)
        return user
        
    def test_create_whitelist_success(self):
        """Test creation of new record in Access Control table success."""
        self.get_authenticated_user('personal','test@example.com')
        
        data = {
            "domain_type":"whitelist",
            "domain":"string.com"
        }
        res = self.client.post(CREATE_ACL,data=data)
        self.assertEqual(res.status_code,status.HTTP_201_CREATED)
        self.assertEqual(res.json()['domain'],"string.com")
        self.assertEqual(res.json()['domain_type'],"whitelist")

    def test_create_blacklist_success(self):
        """Test creation of new record in Access Control table success."""
        self.get_authenticated_user('personal','test@example.com')
        
        data = {
            "domain_type":"blacklist",
            "domain":"string.com"
        }
        res = self.client.post(CREATE_ACL,data=data)
        self.assertEqual(res.status_code,status.HTTP_201_CREATED)
        self.assertEqual(res.json()['domain'],"string.com")
        self.assertEqual(res.json()['domain_type'],"blacklist")
        
    def test_create_whitelist_success_with_schema(self):
        """Test creation of new record with url schema in Access Control table success."""
        self.get_authenticated_user('personal','test@example.com')
        
        data = {
            "domain_type":"whitelist",
            "domain":"http://www.string1.com"
        }
        res = self.client.post(CREATE_ACL,data=data)
        self.assertEqual(res.status_code,status.HTTP_201_CREATED)
        self.assertEqual(res.json()['domain'],"string1.com")
        self.assertEqual(res.json()['domain_type'],"whitelist")

    def test_create_blacklist_success_with_schema(self):
        """Test creation of new record with schema in Access Control table success."""
        self.get_authenticated_user('personal','test@example.com')
        
        data = {
            "domain_type":"blacklist",
            "domain":"http://www.string.com"
        }
        res = self.client.post(CREATE_ACL,data=data)
        self.assertEqual(res.status_code,status.HTTP_201_CREATED)
        self.assertEqual(res.json()['domain'],"string.com")
        self.assertEqual(res.json()['domain_type'],"blacklist")

    def test_create_invalid_domain_type_success(self):
        """Test creation of new record with invalid domain_type in Access Control table success."""
        self.get_authenticated_user('personal','test@example.com')
        
        data = {
            "domain_type":"invalid",
            "domain":"string.com"
        }
        res = self.client.post(CREATE_ACL,data=data)
        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res.json(),{
                "domain_type": [
                    "\"invalid\" is not a valid choice."
                ]
                }
            )

    def test_create_whitelist_failed_duplicate(self):
        self.get_authenticated_user('personal','test@example.com')
        
        data = {
            "domain_type":"whitelist",
            "domain":"http://www.string1.com"
        }
        res = self.client.post(CREATE_ACL,data=data)
        res = self.client.post(CREATE_ACL,data=data)
        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res.json(),{
                "detail":"Domain already exists."
                }
            )
        
    def test_list_domain_success(self):
        self.get_authenticated_user('personal','test@example.com')
        res = self.client.get(CREATE_ACL)
        self.assertEqual(res.status_code,status.HTTP_200_OK)
        self.assertEqual(res.json(),{'count': 0, 'next': None, 'previous': None, 'results': []})
    