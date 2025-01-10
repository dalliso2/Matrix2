package com.dca.matrix.entity_file;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.dca.matrix.api.ApiErrorCode;
import com.dca.matrix.authorization.AuthorizationService;
import com.dca.matrix.exception.MatrixUncheckedException;
import com.dca.matrix.exception.MatrixValidationException;
import com.dca.matrix.file.MFile;
import com.dca.matrix.file.MFileRepository;
import com.dca.matrix.matrix_entity.MatrixEntity;
import com.dca.matrix.matrix_entity.MatrixEntityRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EntityFileServiceImpl implements EntityFileService
{
	private final EntityFileRepository entityFileRepository;
	private final MatrixEntityRepository meRepository;
	private final MFileRepository mfRepository;
	private final AuthorizationService authService;
	
	@Override
	@Transactional
	public EntityFile save(EntityFile entityFile)
	{
		this.authService.verifyUserCanModify(entityFile.getMatrixEntity().getMatrixCase().getId());
		MatrixEntity entity = this.meRepository.findById(entityFile.getMatrixEntity().getId()).orElseThrow(()->
					new MatrixValidationException("Entity with id " + entityFile.getMatrixEntity().getId() + " does not exist.",
							null, ApiErrorCode.ENTITY_DOES_NOT_EXIST));
		
		MFile mf = this.mfRepository.findById(entityFile.getMFile().getId()).orElseThrow(()->
						new MatrixValidationException("File with id " + entityFile.getMFile().getId() + " does not exist.",
								null, ApiErrorCode.FILE_DOES_NOT_EXIST));
		
		EntityFile tempEntityFile = new EntityFile();
		tempEntityFile.setMatrixEntity(entity);
		tempEntityFile.setMFile(mf);
		
		return this.entityFileRepository.save(tempEntityFile);
	}

	@Override
	@Transactional
	public EntityFile remove(EntityFile entityFile)
	{
		this.authService.verifyUserCanModify(entityFile.getMatrixEntity().getMatrixCase().getId());
		EntityFile ef = this.entityFileRepository.findById(entityFile.getId()).orElseThrow(()->
				new MatrixValidationException("Entity file with id " + entityFile.getId() + " does not exist.",
						null, ApiErrorCode.ENTITY_FILE_DOES_NOT_EXIST));
		
		this.entityFileRepository.delete(ef);
		return ef;
	}

	@Override
	public List<EntityFile> findForEntity(Long entityId)
	{
		MatrixEntity tempEntity = this.meRepository.findById(entityId).orElseThrow(()->
				new MatrixValidationException("Entity with id " + entityId + " does not exist.",
						null, ApiErrorCode.ENTITY_FILE_DOES_NOT_EXIST));		
		
		this.authService.verifyUserCanView(tempEntity.getMatrixCase().getId());
		
		return this.entityFileRepository.findForEntity(tempEntity);
	}

	@Override
	@Transactional
	public Collection<EntityFile> save(Collection<EntityFile> entityFiles)
	{
		List<EntityFile> efs = new LinkedList<EntityFile>();
		entityFiles.forEach(entityFile->{
			log.debug("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			log.debug("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			log.debug("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			log.debug(entityFile.toString());
			this.authService.verifyUserCanModify(entityFile.getMatrixEntity().getMatrixCase().getId());
			efs.add(this.save(entityFile));
		});
		return efs;
	}
	
}
