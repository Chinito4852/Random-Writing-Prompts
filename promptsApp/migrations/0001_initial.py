# Generated by Django 3.1.6 on 2021-02-10 00:20

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Prompt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('promptType', models.CharField(blank=True, default='', max_length=20)),
                ('text', models.CharField(blank=True, default='', max_length=300)),
            ],
        ),
    ]
