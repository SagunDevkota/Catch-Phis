from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.postgres.search import TrigramSimilarity

class LegitDomain(models.Model):
    """
    Model to save a list of legitimate domains and provide similarity search functionality.

    Attributes:
        domain (CharField): Stores the domain name as a string with a maximum length of 255 characters.

    Methods:
        search_similar(cls, query, similarity_threshold=0.3):
            Performs a trigram similarity search on LegitDomain objects based on the 'domain' field.
            Returns objects where the trigram similarity score meets or exceeds the specified threshold,
            ordered by descending similarity score and then by domain name alphabetically.
    """
    domain = models.CharField(max_length=255,default=None,null=True,unique=True)

    @classmethod
    def search_similar(cls, query: str, similarity_threshold=0.3):
        """Return the list of similay domains based on a query

        Args:
            query (str): domain name to match
            similarity_threshold (float, optional): Minimum similarity required to return domain. Defaults to 0.3.

        Returns:
            _type_: _description_
        """
        return cls.objects.annotate(
            similarity=TrigramSimilarity('domain', query)
        ).filter(similarity__gte=similarity_threshold).order_by('-similarity', 'domain')

    def __str__(self) -> str:
        return self.domain

class PredictionLog(models.Model):
    url = models.CharField(max_length=255, null=False)
    favicon = models.IntegerField(null=False)
    has_title = models.IntegerField(null=False)
    title = models.CharField(max_length=255, null=False)
    has_copyright_info = models.IntegerField(null=False)
    has_social_media_links = models.IntegerField(null=False)
    has_description = models.IntegerField(null=False)
    has_external_form_submit = models.IntegerField(null=False)
    iframe = models.IntegerField(null=False)
    has_hidden_field = models.IntegerField(null=False)
    has_password_field = models.IntegerField(null=False)
    no_of_images = models.IntegerField(null=False)
    no_of_css = models.IntegerField(null=False)
    no_of_js = models.IntegerField(null=False)
    no_of_self_ref = models.IntegerField(null=False)
    url_length = models.IntegerField(null=False)
    domain_length = models.IntegerField(null=False)
    is_domain_ip = models.IntegerField(null=False)
    no_of_subdomain = models.IntegerField(null=False)
    no_of_letters_in_url = models.IntegerField(null=False)
    letter_ratio_in_url = models.FloatField(null=False)
    no_of_digits_in_url = models.IntegerField(null=False)
    digit_ratio_in_url = models.FloatField(null=False)
    no_of_equal_in_url = models.IntegerField(null=False)
    no_of_question_mark_in_url = models.IntegerField(null=False)
    no_of_ampersand_in_url = models.IntegerField(null=False)
    no_of_other_special_char_in_url = models.IntegerField(null=False)
    special_char_symbol_ratio_in_url = models.FloatField(null=False)
    has_https = models.IntegerField(null=False)
    has_robots = models.IntegerField(null=False)
    domain_title_match_score = models.FloatField(null=False)
    url_similarity_index = models.IntegerField(null=False)
    char_continuous_rate = models.FloatField(null=False)
    domain = models.CharField(max_length=255, null=False, unique=True)
    svc_pca = models.IntegerField(null=False)
    xgboost_pca = models.IntegerField(null=False)
    corrected_output = models.IntegerField(null=True, blank=True)

    def __str__(self) -> str:
        return self.domain
    
class UserWebsiteInteraction(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    website_log = models.ForeignKey(PredictionLog, on_delete=models.CASCADE)
    interaction_datetime = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'User Website Interaction'
        verbose_name_plural = 'User Website Interactions'

    def __str__(self):
        return f'{self.user.email} - {self.website_log.domain}'