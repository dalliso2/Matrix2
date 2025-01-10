package com.dca.matrix;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalUnit;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

import com.dca.matrix.agency.Agency;
import com.dca.matrix.agency.AgencyRepository;
import com.dca.matrix.agency.AgencyService;
import com.dca.matrix.entity_definition.EntityDefinition;
import com.dca.matrix.entity_definition.EntityDefinitionRepository;
import com.dca.matrix.file.FileStorageService;
import com.dca.matrix.file.MFile;
import com.dca.matrix.matrix_case.MatrixCase;
import com.dca.matrix.matrix_case.MatrixCaseRepository;
import com.dca.matrix.matrix_case.MatrixCaseService;
import com.dca.matrix.matrix_entity.EntityRelationshipMessage;
import com.dca.matrix.matrix_entity.EntityRelationshipRepository;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.matrix_entity.MatrixEntityRepository;
import com.dca.matrix.matrix_entity.MatrixEntityService;
import com.dca.matrix.property_definition.PropertyDefinition;
import com.dca.matrix.property_definition.PropertyDefinitionRepository;
import com.dca.matrix.property_definition.PropertyType;
import com.dca.matrix.property_value.PropertyValue;
import com.dca.matrix.user.MatrixUser;
import com.dca.matrix.user.MatrixUserRepository;
import com.dca.matrix.user.MatrixUserService;
import com.dca.matrix.user_case_role.CaseRoleEnum;
import com.dca.matrix.user_case_role.UserCaseRole;
import com.dca.matrix.user_case_role.UserCaseRoleRepository;

import jakarta.transaction.Transactional;

@Configuration
public class TestDataGenerator
{
	@Value("${test.data.agency.filePath}")
	String agencyTestDataFilePath;

	@Value("${test.data.user.filePath}")
	String userTestDataFilePath;

	@Value("${test.data.users.images.dirPath}")
	String userImageDirPath;

	@Value("${test.data.person.filePath}")
	String personTestDataFilePath;

	@Value("${test.data.person.images.dirPath}")
	String personImageDirPath;

	String li = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.";

	//@Bean
	@Transactional
	CommandLineRunner createAgencies(PasswordEncoder pwdEncoder, AgencyRepository agencyRepository,
			MatrixUserRepository userRepository, MatrixCaseRepository caseRepository,
			EntityDefinitionRepository edRepository, PropertyDefinitionRepository pdRepository,
			UserCaseRoleRepository ucrRepository, MatrixEntityRepository meRepository,
			EntityRelationshipRepository erRepository, MatrixEntityService meService,
			FileStorageService fileStorageService)
	{
		return args -> {
			int caseCount = 100;
			int userCount = 500;
			int maxUsersPerCase = 40;
			int eventsPerCase = 30;

			ArrayList<Agency> agencies = new ArrayList<>();
			ArrayList<MatrixUser> users = new ArrayList<>();
			
			Path agencyData = Paths.get(agencyTestDataFilePath);
			try (final BufferedReader reader = Files.newBufferedReader(agencyData))
			{
				// read header
				reader.readLine();
				String line = null;
				while ((line = reader.readLine()) != null)
				{
					String[] tokens = line.split(",");

					Agency a = new Agency();
					a.setName(tokens[0]);
					a.setAcronym(tokens[1]);
					agencies.add(agencyRepository.save(a));
				}
			}

			Path userData = Paths.get(userTestDataFilePath);
			var fileIterator = Files.list(Path.of(userImageDirPath)).iterator();
			try (final BufferedReader reader = Files.newBufferedReader(userData);)
			{
				// read header
				reader.readLine();
				String line = null;
				while ((line = reader.readLine()) != null && userCount-- > 0)
				{
					String[] tokens = line.split(",");

					try
					{
						MatrixUser user = new MatrixUser();
						Agency userAgency = agencies.get((int) (Math.random() * agencies.size()));
						user.setAgency(userAgency);
						user.setFirstName(tokens[0]);
						user.setLastName(tokens[1]);
						String username = tokens[0].substring(0, 1) + tokens[1];
						user.setUsername(username);
						user.setEmail(username + "@" + userAgency.getAcronym().toLowerCase() + ".gov");
						user.setCellNumber(tokens[2]);
						user.setWorkNumber(tokens[3]);
						user.setDarkTheme(Math.round(Math.random()) > 0.5);
						user.setEnabled(Math.round(Math.random()) > 0.1);
						user.setPassword(pwdEncoder.encode("password"));

						Path nextFile = fileIterator.next();
						user.setProfileImage(fileStorageService.saveFileInputStream(Optional.empty(),
								Files.newInputStream(nextFile), nextFile.getFileName().toString()));
						users.add(userRepository.save(user));
					}
					catch (Exception ex)
					{
						// catch errors where username may be duplicated due to randomly generated test
						// data
					}
				}
			}

			// create cases

			ArrayList<MatrixCase> caseList = new ArrayList<>();
			// create cases
			for (int c = 0; c < caseCount; c++)
			{
				MatrixCase mcase = new MatrixCase();
				mcase.setCaseNumber(String.valueOf(1000000 + c));
				mcase.setDescription(li.substring(0, (int) (Math.random() * li.length())));
				mcase.setTitle("Crime " + c + ";" + "\nVictim" + c + ";\nCity,State");
				// set case admin
				
				for (int cu = 0;cu < (int)(Math.random() * maxUsersPerCase);cu ++)
				{
				
				}
				caseList.add(caseRepository.save(mcase));
			}

//			// create entity definitions

			EntityDefinition person = new EntityDefinition();
			person.setIncludeInLinkChart(true);
			person.setName("Person");
			person.setVersion(1L);
			List<PropertyDefinition> pd = new LinkedList<PropertyDefinition>();
			person.setProps(pd);
			var personLastName = new PropertyDefinition();
			personLastName.setType(PropertyType.TEXT);
			personLastName.setName("Last name");
			personLastName.setIncludeInList(true);
			personLastName.setIncludeInTitle(true);
			personLastName.setRequired(true);
			pd.add(personLastName);

			var personFirstName = new PropertyDefinition();
			personFirstName.setType(PropertyType.TEXT);
			personFirstName.setName("First name");
			personFirstName.setIncludeInList(true);
			personFirstName.setIncludeInTitle(true);
			personFirstName.setRequired(true);
			pd.add(personFirstName);

			var DOB = new PropertyDefinition();
			DOB.setType(PropertyType.DATE);
			DOB.setName("DOB");
			DOB.setRequired(true);
			pd.add(DOB);

			var email = new PropertyDefinition();
			email.setType(PropertyType.TEXT);
			email.setName("Email");
			email.setRequired(true);
			pd.add(email);

			var SSN = new PropertyDefinition();
			SSN.setType(PropertyType.TEXT);
			SSN.setName("SSN");
			SSN.setMask("999-99-9999");
			SSN.setRequired(false);
			pd.add(SSN);

			var gender = new PropertyDefinition();
			gender.setType(PropertyType.SELECT);
			gender.setName("Gender");
			gender.setRequired(true);
			gender.setOptions("Male\nFemale");
			pd.add(gender);

			var profileImage = new PropertyDefinition();
			profileImage.setType(PropertyType.PROFILE_IMAGE);
			profileImage.setName("Image");
			profileImage.setRequired(false);
			profileImage.setIncludeInList(true);
			pd.add(profileImage);

			final EntityDefinition finalPerson = edRepository.save(person);

			var event = new EntityDefinition();
			event.setName("Event");
			event.setVersion(1L);
			pd = new LinkedList<PropertyDefinition>();
			event.setProps(pd);
			var title = new PropertyDefinition();
			title.setType(PropertyType.TEXT);
			title.setName("Title");
			title.setIncludeInList(true);
			title.setIncludeInTitle(true);
			title.setRequired(true);
			pd.add(title);

			var description = new PropertyDefinition();
			description.setType(PropertyType.MULTILINE_TEXT);
			description.setName("Description");
			description.setIncludeInList(true);
			description.setIncludeInTitle(false);
			description.setRequired(true);
			pd.add(description);

			var dateRange = new PropertyDefinition();
			dateRange.setType(PropertyType.DATE_TIME_RANGE);
			dateRange.setName("Date/Time Period");
			dateRange.setIncludeInList(true);
			dateRange.setIncludeInTitle(false);
			dateRange.setRequired(true);
			dateRange.setIncludeInTimeline(true);
			pd.add(dateRange);

			final EntityDefinition finalEvent = edRepository.save(event);

			// generate person data
			Path personData = Paths.get(personTestDataFilePath);
			var personFileIterator = Files.list(Path.of(personImageDirPath)).iterator();
			try (final BufferedReader reader = Files.newBufferedReader(personData))
			{
				// read header
				reader.readLine();

				String line = null;
				while ((line = reader.readLine()) != null)
				{
					String[] tokens = line.split(",");
	
					MatrixEntity me = new MatrixEntity();
					me.setEntityDefinition(person);
					caseList.get((int)(Math.random() * caseList.size())).addEntity(me);
					finalPerson.getProps().forEach(prop -> {
						PropertyValue val = new PropertyValue();
						switch (prop.getName())
						{
							case "Last name" -> {
								val.setPropertyDefinition(personLastName);
								val.setValOrder(0L);
								val.setValue(tokens[1]);
							}
							case "First name" -> {
								val.setPropertyDefinition(personFirstName);
								val.setValOrder(0L);
								val.setValue(tokens[0]);
							}
							case "Email" -> {
								val.setPropertyDefinition(email);
								val.setValOrder(0L);
								// val.setValue(DateTimeFormatter.ISO_OFFSET_DATE_TIME.withZone(ZoneId.systemDefault()).format(Instant.ofEpochSecond((long)(Math.random()
								// * Instant.now().getEpochSecond()))));
								val.setValue(tokens[2]);
							}
							case "Gender" -> {
								val.setPropertyDefinition(gender);
								val.setValOrder(0L);
	//										//val.setValue(DateTimeFormatter.ISO_OFFSET_DATE_TIME.withZone(ZoneId.systemDefault()).format(Instant.ofEpochSecond((long)(Math.random() * Instant.now().getEpochSecond()))));
								val.setValue(tokens[3]);
							}
							case "DOB" -> {
								val.setPropertyDefinition(DOB);
								val.setValOrder(0L);
								// val.setValue(DateTimeFormatter.ISO_OFFSET_DATE_TIME.withZone(ZoneId.systemDefault()).format(Instant.ofEpochSecond((long)(Math.random()
								// * Instant.now().getEpochSecond()))));
								val.setValue(tokens[4]);
							}
							case "SSN" -> {
								val.setPropertyDefinition(SSN);
								val.setValOrder(0L);
								String ssn = Long.toString((long) (Math.random() * 1000000000L));
								val.setValue(tokens[5]);
							}
							case "Image" -> {
								val.setPropertyDefinition(profileImage);
								val.setValOrder(0L);
								Path nextFile = personFileIterator.next();
								try 
								{
									MFile imageFile = fileStorageService.saveFileInputStream(Optional.empty(),
											Files.newInputStream(nextFile), nextFile.getFileName().toString());
									val.setValue(imageFile.getId().toString());
								}
								catch (Exception ex)
								{
									ex.printStackTrace();
								}
							}
						}
						me.addPropertyValue(val);
					});
					meRepository.save(me);
				}
			}

			// generate event data
			caseList.forEach(mcase->
			{
				for (int e = 0; e < eventsPerCase; e++)
				{				
					MatrixEntity me = new MatrixEntity();
					me.setEntityDefinition(finalEvent);
					//me.setMatrixCase(mcase);
					mcase.addEntity(me);
					final var ee = e;
					finalEvent.getProps().forEach(prop->{
						switch (prop.getName())
						{
							case "Title" -> {
								PropertyValue val = new PropertyValue();
								val.setPropertyDefinition(title);
								val.setValOrder(0L);
								val.setValue("Case " + mcase.getId() + "-Event " + ee + "-Title");
								me.addPropertyValue(val);
							}
							case "Description" -> {
								PropertyValue val = new PropertyValue();
								val.setPropertyDefinition(description);
								val.setValOrder(0L);
								val.setValue(li.substring(0, 255));
								me.addPropertyValue(val);
							}
							case "Date/Time Period" -> {
								PropertyValue val = new PropertyValue();
								val.setPropertyDefinition(dateRange);
								val.setValOrder(0L);
								Instant startInstant = Instant.ofEpochSecond((long)(Math.random() * Instant.now().getEpochSecond()));
								val.setValue(DateTimeFormatter.ISO_OFFSET_DATE_TIME.withZone(ZoneId.systemDefault()).format(startInstant));
								me.addPropertyValue(val);
								val = new PropertyValue();
								val.setPropertyDefinition(dateRange);
								val.setValOrder(1L);
								Instant endInstant = startInstant.plusSeconds((long)(Math.random() * 60 * 60 * 24 * 90));
								val.setValue(DateTimeFormatter.ISO_OFFSET_DATE_TIME.withZone(ZoneId.systemDefault()).format(endInstant));
								me.addPropertyValue(val);
							}
						}
					});
					meRepository.save(me);
				}
			});
			
			/// create entity relationships
			caseList.forEach(mcase2->{
			mcase2.getCaseEntites().forEach(entity->{
				mcase2.getCaseEntites().forEach(entity2->{
					if (!entity.equals(entity2))
					{
						// determine if entities already have a relationship
						if (erRepository.findByParentAndChild(entity.getId(), entity2.getId()).isEmpty() && Math.random() < 0.05)
						{
							// they dont so consider creating one
							EntityRelationshipMessage erMessage = new EntityRelationshipMessage(entity.getId(), 
																								entity2.getId(), 
																								"Entity " + entity.getId() + " - Entity " + entity2.getId(),
																								"Entity " + entity2.getId() + " - Entity" + entity.getId());
							meService.createRelationshipInternal(erMessage);
						}
					}
				});
			});
		});
			
			// end function
		};
	}
}
